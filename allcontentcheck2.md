# Document Checklists & Penalty Calculators - Complete Code Reference

This document contains the complete TypeScript code for all 8 document checklists and the penalty calculator infrastructure.

---

# Part 1: Document Checklists

**Source:** `/ollvy/apps/customer/lib/data/document-checklists.tsx`

## Imports

```typescript
import {
  FileText,
  User,
  Camera,
  FileSignature,
  Home,
  CreditCard,
  Landmark,
  Building2,
  ScrollText,
  FileCheck,
  Globe,
  Briefcase,
  IndianRupee,
  Users,
  Shield,
  BadgeCheck,
  Scale,
  HandshakeIcon,
  Building,
  ShieldCheck,
  ClipboardList,
  Stamp,
  Banknote,
  MapPin,
  FileSpreadsheet,
  Receipt,
  Calculator,
  TrendingUp,
  Search,
  Palette,
  BookOpen,
  Gavel,
} from 'lucide-react'
import { DocumentCategory } from '@/components/tools/DocumentChecklistContent'
```

---

## 1. Private Limited Company Documents (`pvtLtdDocuments`)

```typescript
export const pvtLtdDocuments: DocumentCategory[] = [
  {
    category: 'Identity Documents',
    categoryNote: 'Required for all proposed directors',
    items: [
      {
        icon: <FileText size={14} />,
        name: 'PAN Card',
        note: 'of all directors and shareholders (minimum 2 directors, 2 shareholders)',
        whatIsIt: 'PAN (Permanent Account Number) is a 10-character alphanumeric code issued by the Income Tax Department. It is your tax identity - every financial transaction, company filing, and bank account in India is linked to it. For company incorporation, PAN of every director and shareholder is mandatory. If a shareholder is a corporate entity (another company), that company\'s PAN is required instead.',
        howToGet: 'Most Indian founders already have a PAN. If you have it, just take a clear, well-lit photo of the physical card - front side only. The scan must show all 10 characters clearly. If you need to apply for a new PAN, do it via the NSDL or UTIITSL portals - it takes 5-7 working days and costs ₹107 (Indian address) or ₹1,017 (foreign address). For foreign nationals acting as directors, a passport serves in lieu of PAN.',
        usualIssues: 'Name mismatch is the single most common rejection reason. Your PAN says "Rajesh Kumar Singh" but your Aadhaar says "R K Singh" - MCA will reject this. Check that the exact name matches across PAN, Aadhaar, and the incorporation form. Also check that your PAN is active and not inoperative (PAN becomes inoperative if not linked with Aadhaar - link at incometax.gov.in before submitting).',
        details: [
          'Clear, coloured scan of original PAN card - not a photocopy of a photocopy',
          'All 10 characters of PAN number must be legible in the scan',
          'Name on PAN must exactly match name on Aadhaar card',
          'For foreign nationals: passport is accepted in lieu of PAN',
          'If PAN is not linked with Aadhaar, link it before submission - inoperative PAN causes rejection',
          'Corporate shareholders must provide the company PAN, not a director\'s personal PAN',
        ],
        required: true,
      },
      {
        icon: <User size={14} />,
        name: 'Aadhaar Card',
        note: 'of all directors and shareholders - must be linked with mobile number for OTP verification',
        whatIsIt: 'Aadhaar is a 12-digit unique identification number issued by UIDAI (Unique Identification Authority of India). For company incorporation, Aadhaar is mandatory for Indian directors because the SPICe+ form on the MCA portal uses Aadhaar-based OTP verification to authenticate the director\'s identity. The mobile number linked to your Aadhaar must be active - MCA sends an OTP to it during DSC application.',
        howToGet: 'Take a clear scan of your Aadhaar card, both front and back. Check your mobile is linked to Aadhaar - you can verify and update it at the nearest Aadhaar enrolment centre or via myAadhaar.uidai.gov.in. If your mobile is not linked, it is a 7-10 day process at an enrolment centre. Do this before starting incorporation - it will block the entire process if not done. Foreign nationals are not required to provide Aadhaar.',
        usualIssues: 'Expired or different address on Aadhaar vs the registered office address is fine - they don\'t need to match. The #1 issue is an unlinked or deactivated mobile number. If the OTP doesn\'t arrive, the DSC application fails. Also check that Aadhaar is not locked (you can lock/unlock biometrics at myAadhaar.uidai.gov.in). Never share masked Aadhaar for official filings - provide the full Aadhaar number.',
        details: [
          'Scan both front and back sides of the Aadhaar card',
          'Mobile number linked to Aadhaar must be active for OTP during DSC process',
          'Address on Aadhaar does not need to match the registered office address',
          'Masked Aadhaar (showing only last 4 digits) is NOT accepted for company registration',
          'Foreign nationals are exempt from Aadhaar requirement',
          'Verify your mobile is linked at myAadhaar.uidai.gov.in before starting',
        ],
        required: true,
      },
      {
        icon: <Camera size={14} />,
        name: 'Passport-Size Photographs',
        note: 'recent photo of each director, JPEG format, white background preferred',
        whatIsIt: 'A recent passport-size photograph of each director is required for DSC (Digital Signature Certificate) application. DSC is the electronic signature used to sign all MCA forms. The photograph is part of the identity verification process with the DSC-issuing authority.',
        howToGet: 'Take a standard passport-size photo (35mm x 45mm) against a white or light background. A clean, recent mobile phone selfie against a white wall works fine - no studio required. Save it as a JPEG file. The DSC authority typically wants it as a digital file (under 1MB), not a physical photo.',
        usualIssues: 'Sunglasses, heavy shadows, or blurry photos get rejected by DSC authorities. Make sure the face is clearly visible. Some DSC providers are strict about white backgrounds - check before submitting. Old photos from 5+ years ago are generally fine as long as the resemblance is clear.',
        details: [
          'Digital JPEG format, under 1MB file size',
          'White or light background preferred by most DSC authorities',
          'Face must be fully visible, no sunglasses or head coverings (unless religious)',
          'A clear mobile selfie works - no studio needed',
          'One photograph per director required',
        ],
        required: true,
      },
      {
        icon: <FileSignature size={14} />,
        name: 'Specimen Signature',
        note: 'for DSC application - signature on plain white paper, scanned clearly',
        whatIsIt: 'A specimen signature is your usual signature placed on a plain white sheet of paper, scanned cleanly. It is required during DSC (Digital Signature Certificate) application to verify your signature matches across documents. The DSC authority uses this to cross-check the signature on declaration forms you submit.',
        howToGet: 'Sign your name in black or blue ink on a plain white A4 sheet. Sign once, clearly. Scan at 300 DPI minimum. Save as a JPEG or PDF. Do not sign on lined paper or paper with any background - plain white only. The signature should be your consistent banking signature, not a casual one.',
        usualIssues: 'Pencil signatures are rejected outright. Signatures on coloured, textured, or lined paper are sometimes rejected. Make sure the signature is not cut off at the edges of the scan. A very faint signature (light ink, poor scan) is a common cause of DSC rejection.',
        details: [
          'Sign in black or blue ink on plain white paper',
          'Scan at minimum 300 DPI, save as JPEG',
          'Signature must match your signatures on declaration forms',
          'Do not use pencil - only pen ink',
          'No lined, coloured, or textured paper',
          'One specimen per director required',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Director Address Proof',
    categoryNote: 'Any one document per director - must be recent',
    items: [
      {
        icon: <Home size={14} />,
        name: 'Utility Bill',
        note: 'electricity, gas, water, or telephone bill - not older than 60 days',
        whatIsIt: 'A utility bill showing your current residential address serves as address proof for each director and shareholder. Accepted bills: electricity, gas, water, landline telephone, postpaid mobile. The bill must clearly show your name, address, and be dated within the last 60 days.',
        howToGet: 'Download the latest bill PDF from your electricity/gas/mobile provider\'s app or website. Or photograph the physical bill clearly. Most providers (BSES, MSEDCL, Tata Power, Jio etc.) allow digital download of bills in PDF format from their apps. Make sure the bill is addressed to you personally or to a family member at the same address.',
        usualIssues: 'Bills older than 60 days are rejected. If the bill is in a parent\'s or spouse\'s name at your address, it is generally accepted with a note that you reside there - but some ROC offices prefer it to be in your own name. Prepaid mobile bills are not accepted - only postpaid. Screenshot of a bill in the provider\'s app is not accepted - download the proper PDF or photograph the physical bill.',
        details: [
          'Must be dated within the last 60 days from date of submission',
          'Accepted: electricity, gas, water, landline telephone, postpaid mobile',
          'NOT accepted: prepaid mobile bills, screenshots from apps',
          'Bill does not need to be in the director\'s name - family member at same address is acceptable',
          'Full address including PIN code must be clearly visible',
        ],
        required: false,
      },
      {
        icon: <CreditCard size={14} />,
        name: 'Bank Statement',
        note: 'savings or current account - first page showing name and address, not older than 60 days',
        whatIsIt: 'A bank account statement (typically the first page) showing your name and current residential address is accepted as address proof. This is often the most convenient option as everyone has an active bank account and statements are easily downloadable.',
        howToGet: 'Log in to your internet banking portal or mobile app. Download the account statement for the last 1-3 months. The first page (or cover page) showing your name, address, and account number is what\'s needed - you don\'t need to share all your transactions. Alternatively, ask the bank for a signed and stamped letter confirming your address.',
        usualIssues: 'Statement must show your address. If your bank account address is your old address (a common issue when you\'ve moved), this won\'t work - update your address at the bank first, which takes 1-2 days. The statement must not be older than 60 days.',
        details: [
          'Download from internet banking - first page showing name and address is sufficient',
          'Must not be older than 60 days',
          'The full statement with transactions is not needed - just the page showing your name and address',
          'Address must match the address declared in the incorporation form',
          'Savings account, current account, or NRI account statements all accepted',
        ],
        required: false,
      },
      {
        icon: <Landmark size={14} />,
        name: 'Passport',
        note: 'valid passport - mandatory for foreign directors, optional alternative for Indian directors',
        whatIsIt: 'A valid Indian or foreign passport serves as combined identity and address proof for directors. For foreign nationals acting as directors in an Indian company, a passport is mandatory (in lieu of PAN and Aadhaar). For Indian directors, it is an optional alternative to the utility bill or bank statement as address proof.',
        howToGet: 'Scan the bio-data page (the page with your photo) and the last page (showing address, if printed). For foreign nationals, the documents must be apostilled or notarised by a notary public in the country of issue before submission. If the passport is not in English, a certified English translation must also be submitted.',
        usualIssues: 'Expired passports are not accepted. Foreign director documents not apostilled is the most common foreign director issue - check whether the country of issue is a Hague Convention country (apostille) or not (requires notarisation from Indian embassy/consulate). Passport address pages are sometimes blank - if so, use a utility bill or bank statement for address proof separately.',
        details: [
          'Scan bio-data page clearly - all details must be legible',
          'Passport must be valid (not expired)',
          'For Indian directors: optional, use only if other address proofs are unavailable',
          'For foreign directors: mandatory, must be apostilled or notarised',
          'Foreign language passports need certified English translation',
          'If address page is blank, submit a separate address proof alongside',
        ],
        required: false,
      },
    ],
  },
  {
    category: 'Registered Office Documents',
    categoryNote: 'Where your company will be officially registered',
    items: [
      {
        icon: <Building2 size={14} />,
        name: 'Registered Office Address Proof',
        note: 'utility bill for the office address - electricity, telephone, gas - not older than 60 days',
        whatIsIt: 'Proof of the registered office address is distinct from the director\'s personal address proof. This is a utility bill (electricity, gas, water, telephone) in the name of the property owner showing the address where the company will be registered. Every company must have a registered office address in India - this can be a home address, a rented commercial space, or a virtual office.',
        howToGet: 'Get the utility bill for the office/home address where you want to register the company. If the office is rented, ask the landlord for a recent utility bill for the property. If you are using your own home, use your personal utility bill. Virtual office providers supply a utility bill for their address as part of their service. Digital download from the electricity/gas provider\'s portal is fine.',
        usualIssues: 'Using your home address is perfectly legal and common for startups - do not pay for office space just for this. The address must exist physically - P.O. box addresses are not accepted. The bill must be dated within 60 days. If the bill is in the property owner\'s name (not yours), you also need the NOC from the property owner (see below).',
        details: [
          'Must show the exact address where the company will be registered',
          'Accepted: electricity, gas, water, telephone bill for the property',
          'Must be dated within 60 days',
          'Home address is 100% legal and acceptable as registered office',
          'The bill can be in the property owner\'s name - just also provide the NOC',
          'Virtual office provider\'s utility bill is accepted',
        ],
        required: true,
      },
      {
        icon: <ScrollText size={14} />,
        name: 'Rent Agreement',
        note: 'only if office premises are rented - not required for own property',
        whatIsIt: 'If the registered office is a rented property (commercial or residential), a rent/leave-and-licence agreement is required to prove the company has the right to use that address. This is not needed if you own the property or are using a virtual office (the virtual office agreement takes its place).',
        howToGet: 'If you have a lease or rent agreement already, submit a scanned copy. A registered rent agreement (registered at the sub-registrar office) is stronger than an unregistered one, but both are accepted. For home-based setups where you are paying rent, use your existing rent agreement. If you own the property, skip this - just submit the utility bill.',
        usualIssues: 'Rent agreement expired? An expired agreement combined with a recent utility bill is sometimes accepted at MCA\'s discretion, but to be safe, renew it or get a fresh notarised letter from the landlord confirming your continued occupancy. Agreement must cover the current date of filing.',
        details: [
          'Only required if office premises are rented or leased',
          'Both registered and unregistered agreements are accepted',
          'Agreement must be current - not expired at the time of filing',
          'For home-based startups using their own property: skip this document',
          'Virtual office agreement from the provider replaces this',
        ],
        required: false,
      },
      {
        icon: <FileCheck size={14} />,
        name: 'NOC from Property Owner',
        note: 'No Objection Certificate from property owner - Ollvy prepares this for you',
        whatIsIt: 'An NOC (No Objection Certificate) is a short letter from the property owner giving permission for the company to use their property as the registered office. MCA requires this whenever the registered office utility bill is in someone else\'s name - which is almost always the case for rented offices or when directors use their family home. Ollvy prepares the standard NOC template - the property owner just needs to sign it.',
        howToGet: 'Ollvy provides you the standard NOC letter with the correct legal language. Print it, have the property owner (parent, landlord, or yourself if you own it but the bill is in a relative\'s name) sign it, and scan it back to us. The NOC does not need to be notarised or stamped - a plain paper signed letter is sufficient for MCA purposes.',
        usualIssues: 'People think this is complex - it is not. It is literally 5 lines: "I, [property owner name], owner of [address], hereby consent to the use of the above property as the registered office of [company name]." If the landlord is reluctant to sign, reassure them it does not affect their ownership or create any liability for them.',
        details: [
          'Ollvy provides the standard NOC template - nothing to draft yourself',
          'Property owner signs the letter - no notarisation or stamp paper required',
          'One page, simple format - takes 5 minutes for the owner to review and sign',
          'Required whenever the utility bill is in someone else\'s name',
          'Landlord signing the NOC does not give the company any ownership rights',
        ],
        required: true,
        ollvyProvides: true,
      },
    ],
  },
  {
    category: 'Company Details',
    categoryNote: 'Information needed to draft your incorporation documents',
    items: [
      {
        icon: <Globe size={14} />,
        name: 'Proposed Company Names (3 options)',
        note: 'in order of preference - first available name is reserved by MCA',
        whatIsIt: 'Before a company can be incorporated, its name must be approved by MCA (Ministry of Corporate Affairs). You propose up to 3 names in order of preference through SPICe+ Part-A (RUN - Reserve Unique Name). MCA checks availability against existing company names, trademarks, and prohibited names, then reserves your first available name for 20 days within which you must complete Part-B filing.',
        howToGet: 'Think of 3 options that: (a) end in "Private Limited" (mandatory), (b) reflect your business, (c) are not identical or deceptively similar to an existing company or trademark. Check availability at mca.gov.in/mcafoportal/viewCompanyMasterData.do before proposing. Your 1st choice should be the name you want most. Ollvy guides you through the name search and checks availability before submission.',
        usualIssues: 'Vague names like "India Digital Private Limited" or "Global Tech Private Limited" are rejected because they are too generic or too similar to existing names. Names containing words like "National", "Bank", "Insurance", "Government", "Bharat" etc. require special government approval - avoid these for faster processing. A trademark search alongside MCA search is recommended - if you are planning to trademark your name later, ensure it is available on the IP India database too.',
        details: [
          'Submit 3 names in order of preference - MCA checks each in sequence',
          'Name must end with "Private Limited" - this cannot be abbreviated at incorporation stage',
          'Check availability at mca.gov.in before submitting to avoid rejection',
          'Avoid generic, prohibited, or government-associated words in the name',
          'Ollvy performs a preliminary name availability check before submission',
          'Reserved name is valid for 20 days - Part-B must be filed within this window',
        ],
        required: true,
      },
      {
        icon: <Briefcase size={14} />,
        name: 'Business Activity Description',
        note: 'what your company will do - must match an MCA NIC code',
        whatIsIt: 'You must declare what your company will do - its main business activity. This is mapped to NIC (National Industry Classification) codes, which MCA uses to classify companies. The description goes into the Memorandum of Association (MOA) as the "Objects" clause. What you put here determines what business your company is legally authorised to do - so it should be broad enough to cover current and near-future activities.',
        howToGet: 'Write 2-3 sentences describing your core business: what you sell or provide, to whom, and how. Ollvy maps this to the appropriate NIC codes and drafts the Objects clause for your MOA. You do not need to know the NIC codes yourself - just describe your business in plain language. Example: "We provide software as a service to small businesses for accounting and invoicing."',
        usualIssues: 'Making it too narrow is a common mistake - "selling handmade wooden furniture" is too narrow, but "manufacturing and trading in furniture and home furnishings" covers you better. If you want to raise investment, include "investment in securities and financial instruments" in the ancillary objects. Changing the Objects clause later requires an EGM (Extraordinary General Meeting) and ROC filing - get it right now.',
        details: [
          'Describe in plain language - Ollvy converts it to the correct MCA Objects format',
          'Be broad enough to cover current and near-future business activities',
          'NIC code is assigned by Ollvy based on your description',
          'Consider including ancillary objects if investment or IP licensing is planned',
          'Objects clause is legally binding - company cannot do business outside its objects',
        ],
        required: true,
      },
      {
        icon: <IndianRupee size={14} />,
        name: 'Authorized Capital Details',
        note: 'minimum ₹1 authorised capital - no minimum paid-up capital required',
        whatIsIt: 'Authorised capital is the maximum share capital your company is permitted to issue under its MOA. Paid-up capital is the actual amount shareholders have paid in. As of 2020, there is NO minimum paid-up capital requirement for Pvt Ltd companies. You can incorporate with ₹1 as both authorised and paid-up capital. Most startups incorporate with ₹1,00,000 authorised capital (₹10/share x 10,000 shares) to keep costs manageable - higher authorised capital means higher ROC stamp duty.',
        howToGet: 'Decide: (a) Total authorised capital amount - typically ₹1 lakh for startups. (b) Face value per share - ₹1, ₹10, or ₹100 (₹10 is most common). (c) Number of shares = authorised capital / face value. (d) How many shares each promoter gets (share allocation). Ollvy walks you through this with a simple form - you don\'t need to know the legal structure.',
        usualIssues: 'Setting authorised capital too high in the beginning means paying higher ROC fees. ₹1 lakh authorised capital costs ₹1,000 in ROC stamp duty. ₹10 lakh costs ₹4,000. Match your authorised capital to what you need now - you can always increase it later through Form SH-7. Unequal share splits between founders (51:49 instead of 50:50) matter a lot for future control - think this through.',
        details: [
          'No minimum authorised capital - ₹1 is legally valid',
          'Most startups use ₹1 lakh authorised capital with ₹10 face value = 10,000 shares',
          'Higher authorised capital = higher ROC stamp duty at incorporation',
          'You can increase authorised capital later via Form SH-7',
          'Decide on founder share split before submitting - it is harder to change later',
          'Ollvy provides a simple form to capture this - no legal knowledge needed',
        ],
        required: true,
      },
      {
        icon: <Users size={14} />,
        name: 'Shareholder Details',
        note: 'name, address, PAN, and number of shares for each shareholder',
        whatIsIt: 'Details of all subscribers to the Memorandum of Association - the initial shareholders. This includes their full name (as per PAN), address, PAN number, number of shares subscribed, and the amount paid. For most founder-run startups, the directors and shareholders are the same people. Minimum 2 shareholders required for Pvt Ltd.',
        howToGet: 'Provide the PAN and Aadhaar of each shareholder (already collected above) and decide how shares are split. If a corporate entity (another company or an investment vehicle) is a shareholder, you need that entity\'s PAN, incorporation certificate, and board resolution authorising the subscription. Ollvy creates the subscriber sheet based on your inputs.',
        usualIssues: 'If an investor is a shareholder at incorporation, they need to provide KYC documents before filing. A common mistake is adding shareholders informally and not reflecting them in MCA filings - all shareholders must be listed in the subscriber sheet at incorporation. Foreign shareholders require FIRC (Foreign Inward Remittance Certificate) and FC-GPR filing within 30 days of allotment.',
        details: [
          'Minimum 2 shareholders required - can be same persons as directors',
          'For corporate shareholders: company PAN + incorporation certificate + board resolution',
          'Foreign shareholders: additional FEMA compliance (FC-GPR) required after incorporation',
          'Share split must total 100% of paid-up capital',
          'Ollvy creates the subscriber sheet based on your inputs',
        ],
        required: false,
      },
    ],
  },
  {
    category: 'Digital & Legal',
    categoryNote: 'Ollvy handles these - no action needed from you',
    items: [
      {
        icon: <Shield size={14} />,
        name: 'Digital Signature Certificate (DSC)',
        note: 'Class 3 DSC - mandatory for all directors and subscribers to MOA and AOA',
        whatIsIt: 'A DSC is a secure digital key (a small USB token or virtual certificate) that enables directors to sign MCA e-forms electronically. Without a DSC, you cannot submit a single form on the MCA portal. Class 3 DSC is mandatory for all directors, shareholders who are subscribers to the MOA/AOA, and the professional (CA/CS/CMA) who certifies the SPICe+ form. Ollvy procures DSCs for all directors as part of the incorporation package.',
        howToGet: 'Ollvy handles the entire DSC procurement process. You provide your PAN, Aadhaar, photograph, and specimen signature - Ollvy applies to a government-certified DSC issuing authority (eMudhra, Sify, NSDL etc.). The process involves Aadhaar OTP and a brief video verification call. DSC is typically issued within 1-2 working days. The DSC is valid for 2 years and can be renewed thereafter.',
        usualIssues: 'DSC application fails if your Aadhaar mobile is not active. Video KYC for DSC is done via a live call with the DSC authority - ensure the director is available for a 5-minute call during business hours. If you have a very old DSC from a previous company, check if it is still valid - expired DSCs cause filing rejections at MCA with unclear error messages.',
        details: [
          'Class 3 DSC required - Class 1 and 2 are no longer accepted for MCA filings',
          'Ollvy procures DSC for all directors as part of the incorporation package',
          'Requires: PAN, Aadhaar (with active mobile), photograph, specimen signature',
          'Issued within 1-2 working days via Aadhaar OTP and video verification',
          'Valid for 2 years - renewal costs approximately ₹1,000 per DSC',
          'One DSC per director - each director needs their own, they are not transferable',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <BadgeCheck size={14} />,
        name: 'Director Identification Number (DIN)',
        note: 'unique 8-digit number for every director - obtained as part of SPICe+ filing',
        whatIsIt: 'A DIN (Director Identification Number) is a unique 8-digit number that identifies a director across all MCA filings. Every individual who wants to become a director of any Indian company must have a DIN. If you are incorporating your first company, you will not have a DIN yet - it is applied for as part of the SPICe+ incorporation form (up to 3 new DINs can be applied for simultaneously in SPICe+ Part-B). Ollvy handles this as part of the incorporation process.',
        howToGet: 'You do not need to apply for a DIN separately. Ollvy includes DIN application for up to 3 directors in the SPICe+ form. The DIN is generated automatically when ROC approves the incorporation. If a director already has a DIN from a previous company, that existing DIN is used - just provide the existing DIN number. Existing directors must file DIR-3 KYC annually by September 30 to keep the DIN active.',
        usualIssues: 'If a director already has a DIN but it is deactivated (due to non-filing of DIR-3 KYC), the incorporation will be blocked. Check DIN status at mca.gov.in before filing. A person cannot hold more than 20 DINs simultaneously - but in practice this is rarely an issue for founders.',
        details: [
          'Ollvy applies for DIN as part of the SPICe+ filing - no separate application needed',
          'Up to 3 DINs can be applied for in a single SPICe+ form',
          'Existing directors must provide their existing DIN number',
          'DIN becomes deactivated if DIR-3 KYC is not filed by September 30 each year',
          'Check DIN status at mca.gov.in if unsure whether an existing DIN is active',
          'DIN is permanent and follows you across all company directorships',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <ScrollText size={14} />,
        name: 'MOA and AOA',
        note: 'Memorandum and Articles of Association - Ollvy drafts both',
        whatIsIt: 'The MOA (Memorandum of Association) defines the company\'s relationship with the outside world - its name, registered state, objects (what it will do), liability of members, and authorised capital. The AOA (Articles of Association) is the internal rulebook - governance structure, director powers, shareholder rights, meeting procedures, share transfer rules. Together they are the constitution of the company. Both must be digitally signed by all subscribers and filed with MCA. Ollvy drafts both documents tailored to your business.',
        howToGet: 'You provide the business activity description, authorised capital details, and founder/shareholder information. Ollvy drafts MOA and AOA in the prescribed SPICe+ format (INC-33 and INC-34). You review and digitally sign using your DSC. No need to print, notarise, or physically sign - the entire process is online. Ollvy\'s templates cover standard governance for Pvt Ltd companies suitable for startups, SMEs, and investor-ready structures.',
        usualIssues: 'A generic MOA that doesn\'t cover ancillary activities causes problems when the company wants to do something not in its objects - for example, an e-commerce company that wants to raise a loan from a promoter needs "lending and borrowing" in the objects. Review the objects clause carefully before signing. AOA clauses on share transfers matter most for companies planning external investment - Ollvy\'s investor-ready AOA templates are pre-built for common VC scenarios.',
        details: [
          'Ollvy drafts both MOA and AOA in prescribed format',
          'MOA covers: company name, state, objects, liability, authorised capital',
          'AOA covers: director powers, shareholder rights, meeting procedures, share transfers',
          'Both are digitally signed by all subscribers using their DSCs - no physical signing',
          'Filed electronically as INC-33 (MOA) and INC-34 (AOA) via SPICe+',
          'Ollvy\'s templates include standard provisions suitable for startup structures',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <FileSignature size={14} />,
        name: 'Director Consent Forms',
        note: 'DIR-2, INC-9 declarations - Ollvy prepares, you sign digitally',
        whatIsIt: 'Two statutory declarations are required from each director: (1) DIR-2: Consent to act as director - a formal statement that the person is willing to be a director and is not disqualified. (2) INC-9: Declaration by subscribers and first directors confirming they are not disqualified and have not been convicted of any offence involving moral turpitude. Both are prescribed forms under the Companies Act 2013. Ollvy prepares the draft - directors sign using their DSC.',
        howToGet: 'Ollvy generates these forms pre-filled with your details. You review and sign digitally using your DSC via the MCA portal. No need to print, physically sign, or notarise. If signing manually (for some edge cases), they must be notarised. The online DSC-signed version is preferred and faster.',
        usualIssues: 'Directors sometimes worry about the "not disqualified" declaration - it is a standard compliance statement. If a director has a pending court case, criminal conviction, or is an undischarged insolvent, they may be disqualified. For the vast majority of startup founders, this is a non-issue. Provide accurate details - false declarations are a criminal offence under Companies Act 2013.',
        details: [
          'DIR-2: Consent to act as director - standard for every new director',
          'INC-9: Declaration by first directors and subscribers - statutory requirement',
          'Both prepared by Ollvy and signed by directors using their DSC',
          'No physical printing or notarisation required for the online process',
          'False declarations in these forms are a criminal offence - provide accurate information',
          'One set per director',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <User size={14} />,
        name: 'Email ID and Mobile Number',
        note: 'unique email and mobile for each director - used for MCA OTP authentication',
        whatIsIt: 'MCA requires a unique email address and mobile number for each director and subscriber to MOA/AOA. These are used for: OTP-based e-verification during DSC application, communication from MCA and the Registrar of Companies, and authentication during SPICe+ filing. Each person must provide their own - two directors cannot share the same email or mobile number on the same filing.',
        howToGet: 'Use your regular personal email (Gmail, professional domain etc.) and your active Indian mobile number. These do not need to be new or dedicated - your existing personal email and mobile are fine. Just ensure they are active and you have access to receive OTPs. Note: these details become part of the company\'s MCA filings and are partially visible in the public company master data.',
        usualIssues: 'Two directors using the same email or mobile causes SPICe+ form rejection. Foreign directors need an Indian mobile number for OTP purposes - they can use a family member\'s Indian number as a temporary solution or purchase an Indian SIM before filing. Post-incorporation, always keep MCA email and mobile updated if they change - update via DIR-3 KYC annual form.',
        details: [
          'Each director must provide a unique email and unique mobile number',
          'Two directors cannot share the same email or mobile on the same filing',
          'Must be active - OTPs will be sent to these during DSC and filing process',
          'Foreign directors: an Indian mobile number is required for OTP',
          'These details are partially visible in public MCA company records',
          'Update via DIR-3 KYC annually if email or mobile changes',
        ],
        required: true,
      },
    ],
  },
]
```

---

## 2. LLP Documents (`llpDocuments`)

```typescript
export const llpDocuments: DocumentCategory[] = [
  {
    category: 'Identity Documents',
    categoryNote: 'Required for all designated partners',
    items: [
      {
        icon: <FileText size={14} />,
        name: 'PAN Card',
        note: 'of all designated partners (minimum 2 required)',
        whatIsIt: 'Your PAN identifies you for tax purposes. In an LLP, every designated partner (the ones who manage the business) needs to provide their PAN. It\'s how MCA tracks who\'s running the LLP.',
        howToGet: 'Already have PAN? Take a clear photo. Don\'t have one? Apply at incometax.gov.in - takes about 2 weeks.',
        usualIssues: 'Name mismatch between PAN and Aadhaar causes 80% of rejections. If your PAN says "Amit Kumar" but Aadhaar says "Amit Kumar Sharma", fix it before starting.',
        details: [
          'Clear scan of original PAN card',
          'Name must match Aadhaar exactly',
          'At least 2 designated partners mandatory',
          'Body corporates can also be partners (provide CIN, MOA, Board Resolution)',
        ],
        required: true,
      },
      {
        icon: <User size={14} />,
        name: 'Aadhaar Card',
        note: 'of all partners - both sides',
        whatIsIt: 'Your 12-digit Aadhaar is needed for OTP verification. When we file the LLP, MCA sends OTPs to the mobile linked to your Aadhaar to verify you\'re really you.',
        howToGet: 'Scan or photograph both sides clearly. Check that your mobile is linked at myaadhaar.uidai.gov.in. If linked to an old number, update it at an Aadhaar center first.',
        usualIssues: 'Old mobile number = no OTP = stuck application. This is the #1 delay reason. Verify your linked mobile before we start.',
        details: [
          'Front and back of Aadhaar card',
          'Mobile linked to Aadhaar must be active',
          'Address used for DPIN verification',
          'Foreign partners: passport + India visa + address proof',
        ],
        required: true,
      },
      {
        icon: <Camera size={14} />,
        name: 'Passport-size Photographs',
        note: '2 photos per partner - recent, professional',
        whatIsIt: 'Used for your DPIN (Designated Partner Identification Number) application. Think of DPIN as your "partner license" - this photo goes on official records.',
        howToGet: 'Visit any photo studio, ask for passport photos with white background. Get digital copies emailed. Takes 10 minutes, costs Rs. 50-100.',
        usualIssues: 'Studios sometimes use blue backgrounds by default. Specifically say "white background" or they might give you the wrong format.',
        details: [
          'White background, recent photographs',
          'Standard passport size (3.5cm x 4.5cm)',
          'Used for DPIN application and LLP forms',
        ],
        required: true,
      },
      {
        icon: <FileSignature size={14} />,
        name: 'Specimen Signature',
        note: 'on plain white paper - matching bank/PAN signature',
        whatIsIt: 'A sample of your signature for the Digital Signature Certificate (DSC). Your DSC is your electronic signature - legally equivalent to signing physically.',
        howToGet: 'Sign on white paper with black or blue pen. Take a clear photo with good lighting. Sign the way you normally do on cheques - not a fancy version.',
        usualIssues: 'Inconsistent signatures cause problems. If your DSC signature looks different from your bank signature, banks might question it later.',
        details: [
          'Clear signature on white background',
          'Should match signature on PAN card',
          'High resolution scan required',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Partner Address Proof',
    categoryNote: 'Any one document per partner',
    items: [
      {
        icon: <Home size={14} />,
        name: 'Utility Bill',
        note: 'electricity, water, gas - within last 2 months',
        whatIsIt: 'Proves where you currently live. Any bill showing your residential address works - electricity is most common since everyone has one.',
        howToGet: 'Check email for e-bills, download from utility provider\'s app, or find the physical bill. Parents\' name on bill is fine if you live at the same address.',
        usualIssues: 'Bills older than 2 months get rejected. Mobile phone bills don\'t count - only landline, electricity, water, or gas.',
        details: [
          'Recent utility bill (not older than 2 months)',
          'In partner\'s name or immediate family',
          'Must show current residential address',
        ],
        required: false,
      },
      {
        icon: <CreditCard size={14} />,
        name: 'Bank Statement',
        note: 'latest month with full address visible',
        whatIsIt: 'Your bank statement shows your registered address with the bank. If you can\'t find a utility bill, this is the easiest alternative.',
        howToGet: 'Log into net banking, Statements, Download last month as PDF. Takes 2 minutes. Make sure your address shows on the statement header.',
        usualIssues: 'Some people have their hometown address on bank records but live elsewhere. If that\'s you, use a utility bill instead.',
        details: [
          'Official statement from bank',
          'Shows name and current address',
          'Last 30 days statement sufficient',
        ],
        required: false,
      },
    ],
  },
  {
    category: 'Registered Office Documents',
    categoryNote: 'Official address of your LLP',
    items: [
      {
        icon: <Building2 size={14} />,
        name: 'Office Address Proof',
        note: 'utility bill of LLP premises - recent',
        whatIsIt: 'This proves your LLP\'s office address exists. Government notices will be sent here. Good news: unlike Pvt Ltd, you can easily use your home address for an LLP.',
        howToGet: 'Get the electricity or water bill of your office location. Working from home? Your home\'s electricity bill works perfectly. Co-working space? Ask them for the utility bill.',
        usualIssues: 'Address format must match exactly across all documents. "Flat 12, Tower B" and "12-B Tower" look the same to you but MCA might reject it.',
        details: [
          'Electricity/water/gas bill of office location',
          'Not older than 2 months',
          'This becomes LLP\'s registered address',
          'Residential address allowed for LLP',
        ],
        required: true,
      },
      {
        icon: <ScrollText size={14} />,
        name: 'Rent Agreement',
        note: 'if rented premises - notarized or registered',
        whatIsIt: 'If you\'re renting office space, this shows you have legal permission to use the address. Needed when the utility bill isn\'t in your name.',
        howToGet: 'Get a standard 11-month rent agreement with your landlord. Get it notarized (Rs. 100-200) for extra validity. The address must match the utility bill exactly.',
        usualIssues: 'Expired agreements are common - people forget to renew. Check the dates. Also ensure the rent agreement mentions the same address as the utility bill.',
        details: [
          'Lease/rent agreement for the office',
          'Should be notarized or registered',
          'In favor of LLP or designated partners',
        ],
        required: false,
      },
      {
        icon: <FileCheck size={14} />,
        name: 'NOC from Owner',
        note: 'owner consent letter - template provided by Ollvy',
        whatIsIt: 'A simple one-page letter where the property owner says "I allow this LLP to use my property as their registered office." Required even if it\'s your parents\' house.',
        howToGet: 'We give you a ready template. Fill in the blanks, get the owner to sign, and attach their Aadhaar or PAN copy. 10-minute task.',
        usualIssues: 'People forget to attach the owner\'s ID. The NOC letter alone isn\'t enough - always include their Aadhaar/PAN photocopy.',
        details: [
          'Landlord\'s consent to use as registered office',
          'Include owner\'s ID proof',
          'Ollvy provides ready template',
        ],
        required: true,
        ollvyProvides: true,
      },
    ],
  },
  {
    category: 'LLP Details',
    categoryNote: 'Information for LLP incorporation',
    items: [
      {
        icon: <Globe size={14} />,
        name: 'Proposed LLP Names',
        note: '3 unique names - ending with "LLP"',
        whatIsIt: 'Your LLP\'s official name. Unlike Pvt Ltd where names end with "Private Limited", LLP names must end with "LLP" or "Limited Liability Partnership".',
        howToGet: 'Think of 3 names you like. Format: [Unique Word] + [Business Type] + LLP. Like "Bluewave Consulting LLP" or "Techify Solutions LLP". We check availability before filing.',
        usualIssues: 'Generic names like "Best Consultants LLP" are always taken. Be creative with the first word. Also can\'t use "India", "National" etc. without approval.',
        details: [
          'Must end with "LLP" or "Limited Liability Partnership"',
          'Provide 3 options in preference order',
          'Cannot match existing company/LLP names',
          'Ollvy checks availability before filing',
        ],
        required: true,
      },
      {
        icon: <Briefcase size={14} />,
        name: 'Business Activity',
        note: 'description of LLP\'s main business',
        whatIsIt: 'What will your LLP actually do? This goes into your LLP Agreement and defines your scope. Keep it broad enough to cover future plans.',
        howToGet: 'Write 2-3 lines about your business. Example: "To provide consulting services, software development, and technology solutions." Cover what you do now AND might do later.',
        usualIssues: 'Being too specific limits you. "Mobile app development" is narrow - "software and technology services" gives you room to grow without amending later.',
        details: [
          'Clear description of proposed business',
          'Determines LLP Agreement clauses',
          'Can have multiple business activities',
        ],
        required: true,
      },
      {
        icon: <IndianRupee size={14} />,
        name: 'Capital Contribution',
        note: 'each partner\'s contribution amount - no minimum required',
        whatIsIt: 'How much money (or assets) each partner is putting in. Unlike Pvt Ltd, LLP has no minimum capital requirement. You can start with Rs. 10,000 or Rs. 10 lakh - your choice.',
        howToGet: 'Decide how much each partner will contribute. Common setup: equal contributions from all partners. This can be cash, or even assets like laptops/equipment.',
        usualIssues: 'Partners sometimes want to contribute "later" but you need to specify an amount now. Even Rs. 10,000 each is fine to start - you can increase later.',
        details: [
          'LLP has no minimum capital requirement',
          'Each partner\'s contribution amount',
          'Can be cash or asset contribution',
          'Profit sharing ratio (usually based on contribution)',
        ],
        required: true,
      },
      {
        icon: <Scale size={14} />,
        name: 'Profit Sharing Ratio',
        note: 'how profits will be divided among partners',
        whatIsIt: 'What percentage of profits does each partner get? This doesn\'t have to match capital contribution. One partner might contribute more but agree to equal profit sharing.',
        howToGet: 'Discuss with your partners. Common: equal splits (50-50 for 2 partners). Or based on capital contribution. Or based on who does more work. Document what you agree.',
        usualIssues: 'Not discussing this upfront causes fights later. Agree clearly now, even if awkward. It\'s much worse to fight when there\'s actual money involved.',
        details: [
          'Percentage of profits for each partner',
          'Can be different from capital contribution ratio',
          'Defined in LLP Agreement',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Digital & Legal',
    categoryNote: 'Handled by Ollvy',
    items: [
      {
        icon: <Shield size={14} />,
        name: 'Digital Signature Certificate',
        note: 'for designated partners - Ollvy arranges',
        details: [
          'Class 3 DSC for signing forms',
          'Applied by Ollvy with video verification',
          'USB token delivered to you',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <BadgeCheck size={14} />,
        name: 'DPIN',
        note: 'Designated Partner Identification Number - Ollvy applies',
        whatIsIt: 'A DPIN (Designated Partner Identification Number) is the LLP equivalent of a DIN. Every designated partner of an LLP must have a DPIN before the LLP can be registered. Unlike a Pvt Ltd where only directors need a DIN, in an LLP, only the designated partners (not regular partners) need DPINs. A Pvt Ltd director\'s existing DIN is accepted as DPIN - same number, same system. Ollvy applies for DPINs for all designated partners as part of the LLP filing via Form FiLLiP.',
        howToGet: 'You do not need to apply for a DPIN separately. Ollvy includes DPIN application in the FiLLiP form. If you already have a DIN from a previous company directorship, that same number works as DPIN - just share it with us.',
        usualIssues: 'If a partner already has a DIN/DPIN but it is deactivated (due to non-filing of DIR-3 KYC), the LLP registration will be blocked. Check DPIN/DIN status at mca.gov.in before filing.',
        details: [
          'Unique ID for designated partners',
          'Applied through FiLLiP form',
          'Same DPIN for all LLPs where person is partner',
          'Existing DIN works as DPIN - same number system',
          'DIR-3 KYC must be filed annually by September 30 to keep DPIN active',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <HandshakeIcon size={14} />,
        name: 'LLP Agreement',
        note: 'drafted by Ollvy - defines partner rights and obligations',
        whatIsIt: 'The LLP Agreement is the constitution of your LLP. It defines: (a) the relationship between partners, (b) profit/loss sharing ratios, (c) rights and duties of each partner, (d) decision-making procedures, (e) exit and admission of partners, (f) dispute resolution mechanisms. Unlike a Pvt Ltd MOA/AOA which is largely standard, LLP Agreements are highly customizable to fit your partnership dynamics.',
        howToGet: 'Ollvy drafts a comprehensive LLP Agreement based on your business activity, capital contributions, and how you want to share profits. We share the draft for your review before finalizing. All partners sign using DSC.',
        usualIssues: 'The LLP Agreement must be filed within 30 days of LLP incorporation via Form 3 on the MCA portal. If not filed on time, a penalty of ₹100 per day applies. Ensure profit/loss sharing ratios are explicitly stated - vague ratios ("equally between partners") create disputes. If any partner is contributing intellectual property or services (instead of cash) as their contribution, this must be explicitly valued and mentioned in the agreement. Ollvy\'s LLP Agreement templates cover standard startup scenarios.',
        details: [
          'Comprehensive agreement covering all aspects',
          'Rights and duties of partners',
          'Profit sharing, decision making, exit clauses',
          'Must be filed within 30 days of incorporation - ₹100/day penalty for delay',
          'Ollvy drafts and files on your behalf',
          'IP or service contributions must be explicitly valued',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <User size={14} />,
        name: 'Email ID and Mobile Number',
        note: 'unique email and mobile for each designated partner',
        whatIsIt: 'MCA requires a unique email address and mobile number for each designated partner. These are used for: OTP-based e-verification during DSC application, communication from MCA, and authentication during FiLLiP filing. Each partner must provide their own - two partners cannot share the same email or mobile.',
        howToGet: 'Use your regular personal email and active Indian mobile number. These do not need to be new - your existing personal email and mobile are fine. Just ensure they are active and you have access to receive OTPs.',
        usualIssues: 'Two partners using the same email or mobile causes form rejection. Foreign partners need an Indian mobile number for OTP purposes. Post-incorporation, keep these updated if they change - update via DIR-3 KYC.',
        details: [
          'Each designated partner must provide unique email and mobile',
          'Two partners cannot share the same email or mobile',
          'Must be active - OTPs will be sent during DSC and filing process',
          'Foreign partners: Indian mobile number required for OTP',
          'Update via DIR-3 KYC annually if details change',
        ],
        required: true,
      },
    ],
  },
]
```

---

## 3. Partnership Firm Documents (`partnershipDocuments`)

```typescript
export const partnershipDocuments: DocumentCategory[] = [
  {
    category: 'Identity Documents',
    categoryNote: 'Required for all partners',
    items: [
      {
        icon: <FileText size={14} />,
        name: 'PAN Card',
        note: 'of all partners (minimum 2, maximum 50)',
        whatIsIt: 'Every partner needs a PAN. A partnership is a group of individuals coming together - the government tracks each person separately for tax purposes, even though you\'ll also get a firm PAN later.',
        howToGet: 'Each partner provides a clear photo of their PAN card. If any partner doesn\'t have PAN, apply at incometax.gov.in - takes about 2 weeks. Foreign partners use passport instead.',
        usualIssues: 'Name mismatches between partners\' PAN and Aadhaar cause delays. If one partner has "Amit K Sharma" on PAN and "Amit Kumar Sharma" on Aadhaar, that partner needs to fix their documents first.',
        details: [
          'Clear scan of PAN for each partner',
          'Partnership requires minimum 2 partners',
          'Maximum 50 partners allowed (20 for banking)',
          'Names must match other documents exactly',
        ],
        required: true,
      },
      {
        icon: <User size={14} />,
        name: 'Aadhaar Card',
        note: 'of all partners - front and back',
        whatIsIt: 'Aadhaar serves as identity and address proof for each partner. The addresses from Aadhaar are recorded in the partnership deed.',
        howToGet: 'Each partner photographs both sides of their Aadhaar card clearly. Make sure the mobile number linked to Aadhaar is still active - you may need OTP verification.',
        usualIssues: 'Partners often have Aadhaar with outdated addresses (parents\' house, old city). This is fine for the deed, but make sure the address proof submitted separately is current.',
        details: [
          'Both sides of Aadhaar for each partner',
          'Current address proof',
          'Mobile linked for verification',
        ],
        required: true,
      },
      {
        icon: <Camera size={14} />,
        name: 'Passport-size Photos',
        note: '2 photos per partner',
        whatIsIt: 'Standard passport photos of each partner. These go into firm registration forms and bank account opening documents.',
        howToGet: 'Visit any photo studio and ask for passport-size photos with white background. Cost is around Rs. 50-100 per partner. Ask for digital copies too - useful for online forms.',
        usualIssues: 'Some partners send old photos or photos with colored backgrounds. Photos should be recent (within 6 months) and have a plain white background.',
        details: [
          'Recent photographs with white background',
          'Professional quality',
          'Required for deed and registrations',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Partner Address Proof',
    categoryNote: 'One document per partner',
    items: [
      {
        icon: <Home size={14} />,
        name: 'Utility Bill',
        note: 'recent electricity/water bill',
        whatIsIt: 'Any utility bill showing the partner\'s current residential address. This proves where each partner lives and is used in the partnership deed.',
        howToGet: 'Each partner downloads their latest electricity or water bill from their utility provider\'s app or website. Physical bill works too. If it\'s in a family member\'s name at the same address, that\'s acceptable.',
        usualIssues: 'Bills older than 2 months are not accepted. Partners living in shared apartments sometimes struggle - use bank statement instead if the utility bill isn\'t in your name.',
        details: [
          'Not older than 2 months',
          'In partner\'s name or family member',
          'Shows current residential address',
        ],
        required: false,
      },
      {
        icon: <CreditCard size={14} />,
        name: 'Bank Statement',
        note: 'last month with address',
        whatIsIt: 'An official bank statement showing the partner\'s name and address. Good alternative to utility bills, especially for partners who don\'t have bills in their name.',
        howToGet: 'Log into net banking, download the last month\'s statement as PDF. Make sure the first page shows your full name and complete address. Takes 2 minutes.',
        usualIssues: 'Some partners have bank accounts with hometown addresses even though they live elsewhere. If this is you, use utility bill or update your bank address first.',
        details: [
          'Official bank statement',
          'Shows full name and address',
          'Recent statement preferred',
        ],
        required: false,
      },
    ],
  },
  {
    category: 'Business Premises Documents',
    categoryNote: 'Where the partnership will operate',
    items: [
      {
        icon: <Building2 size={14} />,
        name: 'Office Address Proof',
        note: 'utility bill of business premises',
        whatIsIt: 'This is the address that becomes your firm\'s official "principal place of business." It appears on your GST registration, letterheads, and all official documents.',
        howToGet: 'Get the electricity or water bill of the premises you\'ll use as office. Using a partner\'s home? That\'s fine - grab the home\'s utility bill. The bill should be recent (within 2 months).',
        usualIssues: 'If multiple partners are in different cities, decide one location as the principal place. You can add other locations as "additional places of business" later.',
        details: [
          'Electricity/water bill of office',
          'This becomes firm\'s principal place',
          'Recent bill (within 2 months)',
        ],
        required: true,
      },
      {
        icon: <ScrollText size={14} />,
        name: 'Rent Agreement',
        note: 'if rented - registered or notarized',
        whatIsIt: 'If you\'re renting the office space (not using a partner\'s own property), this agreement shows you have legal permission to operate the business there.',
        howToGet: 'Standard 11-month rent agreement works. Get it notarized (Rs. 100-200). The agreement should mention that the premises can be used for business/commercial purposes.',
        usualIssues: 'Residential rent agreements often say "for residential use only." If yours says this, get the landlord to sign an NOC allowing business use, or get a fresh agreement.',
        details: [
          'Lease agreement for business premises',
          'Should mention business use',
          'Notarized or registered copy',
        ],
        required: false,
      },
      {
        icon: <FileCheck size={14} />,
        name: 'NOC from Owner',
        note: 'owner consent for business use',
        whatIsIt: 'A simple letter where the property owner says they\'re okay with a partnership firm operating from their property. If one partner owns the property, they still sign this.',
        howToGet: 'We provide a ready template. Fill in the property details, get the owner to sign, and attach their Aadhaar or PAN copy. If a partner owns the property, that partner signs the NOC.',
        usualIssues: 'People forget to attach the owner\'s ID proof. Without it, the NOC is incomplete. Always include owner\'s Aadhaar or PAN copy.',
        details: [
          'Property owner\'s no-objection letter',
          'Include owner\'s ID proof',
          'Template provided by Ollvy',
        ],
        required: true,
        ollvyProvides: true,
      },
    ],
  },
  {
    category: 'Partnership Details',
    categoryNote: 'Information for partnership deed',
    items: [
      {
        icon: <Briefcase size={14} />,
        name: 'Firm Name',
        note: 'proposed name of partnership firm',
        whatIsIt: 'The official name of your partnership firm. Unlike companies, partnership names don\'t need approval - but you can\'t use protected terms like "Ltd" or "LLP."',
        howToGet: 'Decide on a name with all partners. Keep it simple and relevant to your business. Check informally that no one in your city is using the exact same name to avoid confusion.',
        usualIssues: 'Partners sometimes want to add "Pvt Ltd" or "India" - partnership firms can\'t use these. Also, if you\'re planning to trademark the name later, do a trademark search first.',
        details: [
          'Name for your partnership firm',
          'Should reflect business nature',
          'Check for local trademark conflicts',
          'Cannot use "Pvt Ltd", "LLP", etc.',
        ],
        required: true,
      },
      {
        icon: <Globe size={14} />,
        name: 'Business Nature',
        note: 'detailed description of activities',
        whatIsIt: 'A description of what your partnership will actually do. This goes into the deed and determines what activities you can legally conduct under this firm.',
        howToGet: 'List all business activities you might do - trading, manufacturing, services, consulting, etc. Be thorough. It\'s harder to add activities later than to include them from the start.',
        usualIssues: 'Being too narrow hurts you later. If you write "selling electronics" and later want to sell furniture, you technically need to amend the deed. Write broader: "trading in goods of all kinds."',
        details: [
          'All business activities the firm will undertake',
          'Used in partnership deed and GST registration',
          'Be comprehensive - hard to add later',
        ],
        required: true,
      },
      {
        icon: <IndianRupee size={14} />,
        name: 'Capital Contribution',
        note: 'each partner\'s investment amount',
        whatIsIt: 'How much money (or assets) each partner is putting into the business. This doesn\'t have to be equal - one partner can contribute more than others.',
        howToGet: 'Discuss with all partners and decide the amount each person is contributing. It can be cash, equipment, property, or even goodwill. There\'s no minimum requirement.',
        usualIssues: 'Partners sometimes say "we\'ll figure it out later." The deed needs exact amounts. Even if it\'s Rs. 10,000 each, put it in writing. You can add more capital later via a supplementary deed.',
        details: [
          'Amount each partner is contributing',
          'Can be cash, assets, or goodwill',
          'No minimum capital requirement',
          'Documented in partnership deed',
        ],
        required: true,
      },
      {
        icon: <Scale size={14} />,
        name: 'Profit/Loss Sharing Ratio',
        note: 'how profits and losses are divided',
        whatIsIt: 'The percentage of profits (and losses) each partner gets. This can be different from capital contribution - a partner who works more might get a higher share despite investing less.',
        howToGet: 'Discuss and agree on percentages with all partners. The total must be 100%. Common splits are equal (50-50, 33-33-33) but any ratio is valid if all partners agree.',
        usualIssues: 'Partners sometimes want profit sharing but not loss sharing. That\'s not how it works - you share both. Also, remember this ratio is for splitting profits after paying salaries (if any).',
        details: [
          'Percentage share for each partner',
          'Can be different from capital ratio',
          'Must add up to 100%',
          'Clearly mentioned in deed',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Legal Documentation',
    categoryNote: 'Ollvy drafts the deed - you review and sign',
    items: [
      {
        icon: <ClipboardList size={14} />,
        name: 'Partnership Deed',
        note: 'comprehensive agreement - drafted by Ollvy',
        whatIsIt: 'The partnership deed is the constitution of your firm. It\'s a legal contract between all partners covering capital, profits, roles, dispute resolution, exit terms - everything.',
        howToGet: 'We draft a comprehensive deed based on the details you provide. You review it, suggest changes if needed, then all partners sign it on stamp paper. We handle the entire process.',
        usualIssues: 'The most common issue is a vague profit-sharing clause. "Equally among partners" is fine when things are good. When they go wrong, "equally" leads to disputes. Specify exact percentages. Also specify: what happens if a partner wants to exit, what happens on death of a partner, and what the decision-making process is for major business decisions. Stamp duty on partnership deeds varies by state - in Maharashtra it is ₹500, in Delhi it is ₹100. Ollvy prepares the deed on appropriate stamp paper for your state.',
        details: [
          'Legally binding agreement between partners',
          'Covers all aspects: capital, profits, duties, disputes',
          'Must be executed on stamp paper',
          'Stamp duty varies by state - Ollvy procures correct value',
          'Specify exact percentages, not vague terms like "equally"',
          'Include exit, death, and decision-making clauses',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <Stamp size={14} />,
        name: 'Stamp Paper',
        note: 'as per state - Ollvy procures appropriate value',
        whatIsIt: 'Partnership deeds must be printed on stamp paper of specific value. The value depends on your state and the capital amount mentioned in the deed.',
        howToGet: 'We procure the correct denomination stamp paper for your state. You don\'t need to worry about this - we calculate the required value and arrange it.',
        usualIssues: 'Using wrong stamp value can make the deed invalid or attract penalties. Each state has different rates. We ensure it\'s correct.',
        details: [
          'Non-judicial stamp paper',
          'Value depends on state and capital',
          'Ollvy procures correct denomination',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <ShieldCheck size={14} />,
        name: 'Partnership PAN',
        note: 'separate PAN for the firm - Ollvy applies',
        whatIsIt: 'Your partnership firm gets its own PAN, separate from the partners\' personal PANs. This firm PAN is used for all business transactions, GST, and filing the firm\'s ITR.',
        howToGet: 'The partnership firm\'s PAN is separate from the individual partners\' PANs. Apply for the firm PAN at NSDL/UTIITSL using Form 49A after the partnership deed is executed. Ollvy handles this as part of the registration package. The firm\'s PAN is required to open a bank account, file GST, and file ITR for the firm. Allow 5-7 working days after deed execution.',
        usualIssues: 'Some people try to operate using a partner\'s personal PAN. This creates accounting nightmares and tax issues. Always get a separate firm PAN - it\'s ₹107 and essential.',
        details: [
          'Firm gets its own PAN (different from partners\' personal PANs)',
          'Required for GST registration and bank account opening',
          'Applied via Form 49A after deed execution',
          'Ollvy handles the PAN application process',
          'Takes 5-7 working days to receive',
        ],
        required: true,
        ollvyProvides: true,
      },
    ],
  },
]
```

---

---

## 4. GST Registration Documents (`gstDocuments`)

```typescript
export const gstDocuments: DocumentCategory[] = [
  {
    category: 'Identity Documents',
    categoryNote: 'Your personal KYC documents',
    items: [
      {
        icon: <FileText size={14} />,
        name: 'PAN Card',
        note: 'of the proprietor / all directors (for companies) / all partners (for firms)',
        whatIsIt: 'In a sole proprietorship, you ARE the business. Your personal PAN becomes your business PAN. No separate company PAN exists - everything runs under your name. For companies and LLPs, the entity\'s own PAN is used for GST registration (not the director\'s personal PAN).',
        howToGet: 'Just use your existing personal PAN card. Take a clear photo where all text is readable. If you don\'t have PAN, apply at incometax.gov.in (takes 2 weeks). For companies, the company PAN is issued automatically at incorporation.',
        usualIssues: 'For a company, the company\'s PAN is required (not the director\'s personal PAN) for GST registration. The company gets its PAN automatically at incorporation. For a sole proprietor, your personal PAN is used. PAN must be linked with Aadhaar for the Aadhaar authentication step in GST registration. Check linkage at incometax.gov.in before starting.',
        details: [
          'Clear colored scan of PAN card',
          'Sole proprietorship: personal PAN is business PAN',
          'Company/LLP: use entity PAN (issued at incorporation)',
          'Must be linked with Aadhaar for authentication',
          'Check PAN-Aadhaar linkage before starting GST registration',
        ],
        required: true,
      },
      {
        icon: <User size={14} />,
        name: 'Aadhaar Card',
        note: 'front and back - mobile must be linked',
        whatIsIt: 'Your 12-digit Aadhaar proves your identity. OTPs will be sent to the mobile linked to your Aadhaar during GST registration.',
        howToGet: 'Scan or photo both sides. Verify your mobile is linked at myaadhaar.uidai.gov.in. If it shows an old number, update it at an Aadhaar center before starting.',
        usualIssues: 'Wrong mobile number is the #1 blocker. OTPs go to whatever number is linked - if that\'s your old SIM, you\'re stuck. Verify and update first.',
        details: [
          'Both sides of Aadhaar card',
          'Mobile number must be active for OTP verification',
          'Address proof if within last 3 months',
        ],
        required: true,
      },
      {
        icon: <Camera size={14} />,
        name: 'Passport-size Photo',
        note: 'recent, white background',
        whatIsIt: 'Standard passport photo for GST registration. This appears on your GST certificate.',
        howToGet: 'Any photo studio (Rs. 50-100). Ask for "passport size, white background." Get digital copies emailed. Takes 10 minutes.',
        usualIssues: 'Old photos or selfies get rejected. The photo should be recent (within 6 months) and professional-looking.',
        details: [
          'Recent photograph (within 6 months)',
          'White background, professional attire',
          'Required for GST registration',
        ],
        required: true,
      },
      {
        icon: <User size={14} />,
        name: 'Email ID and Mobile Number',
        note: 'active email and mobile for OTP verification on GST portal - must be in India',
        whatIsIt: 'GST registration requires email and mobile verification via OTP on the GST portal (gst.gov.in). These become the primary credentials for your GST account - you will receive return filing reminders, GSTIN details, and tax authority communications on these.',
        howToGet: 'Use your active personal or business email address and Indian mobile number. These should be numbers you check regularly - GST deadlines and notices are sent here.',
        usualIssues: 'If the mobile or email is not immediately accessible for OTP, registration stalls. Foreign proprietors/directors must use an Indian mobile.',
        details: [
          'One email and one mobile for the entire GST registration',
          'Must be active and accessible for real-time OTP',
          'Indian mobile number required - foreign numbers not accepted by GST portal',
          'You will receive GST filing reminders and notices on these contact details',
          'Update post-registration via GST portal if they change',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Business Address Proof',
    categoryNote: 'Where your business operates from',
    items: [
      {
        icon: <Home size={14} />,
        name: 'Utility Bill',
        note: 'of business premises - electricity/water',
        whatIsIt: 'Proves where your business operates from. For sole proprietors working from home, your home electricity bill works perfectly.',
        howToGet: 'Find your latest electricity or water bill. Download from utility provider\'s app or check your email for e-bills. Bill should be recent (within 2 months).',
        usualIssues: 'The address on the bill must exactly match the address entered in the GST registration form - even minor differences can cause a mismatch flag.',
        details: [
          'Recent utility bill (within 2 months)',
          'Can be residential if running business from home',
          'In your name or with NOC from owner',
          'Address must match GST form exactly - including format',
          'Coworking spaces: ask provider for GST-ready utility document',
        ],
        required: true,
      },
      {
        icon: <ScrollText size={14} />,
        name: 'Rent Agreement',
        note: 'if operating from rented premises',
        whatIsIt: 'If you\'re renting office/shop space, this proves you have legal permission to operate from that address.',
        howToGet: 'Get a standard rent agreement from your landlord. Notarized is better. Should clearly mention the address and that it\'s for business use.',
        usualIssues: 'Expired agreements cause rejections. Check the end date. If expired, get a fresh agreement made.',
        details: [
          'Lease/rent agreement for business premises',
          'Should mention commercial/business use',
          'Notarized copy preferred',
        ],
        required: false,
      },
      {
        icon: <FileCheck size={14} />,
        name: 'NOC from Owner',
        note: 'if utility bill not in your name',
        whatIsIt: 'A letter from the property owner saying "I\'m okay with this person running their business from my property." Needed when bills aren\'t in your name.',
        howToGet: 'We give you a template. Fill it in, get the owner (could be your parents) to sign, attach their Aadhaar copy. 10 minutes.',
        usualIssues: 'Forgetting to attach owner\'s ID proof. Always include their Aadhaar or PAN copy along with the signed NOC.',
        details: [
          'Property owner\'s consent letter',
          'Required if bills are in owner\'s name',
          'Template provided by Ollvy',
        ],
        required: false,
        ollvyProvides: true,
      },
    ],
  },
  {
    category: 'Bank & Financial',
    categoryNote: 'For business verification',
    items: [
      {
        icon: <CreditCard size={14} />,
        name: 'Bank Statement',
        note: 'last 3 months - personal or business account',
        whatIsIt: 'Shows your banking activity. GST registration needs this to verify you\'re a real business. Can use personal savings account - no need for a current account initially.',
        howToGet: 'Download from net banking: Statements, Last 3 months, Download PDF. If you have a business current account, that\'s preferred. Personal savings works too.',
        usualIssues: 'Account with zero transactions looks suspicious. If your account is mostly inactive, use a more active account.',
        details: [
          'Latest 3 months bank statement',
          'Shows regular transactions',
          'Business current account statement if available',
          'Required for GST registration',
        ],
        required: true,
      },
      {
        icon: <Banknote size={14} />,
        name: 'Cancelled Cheque',
        note: 'from your bank account',
        whatIsIt: 'A cheque leaf with "CANCELLED" written on it. Shows your account number, IFSC code, and name. Used to verify bank account details.',
        howToGet: 'Take a cheque from your chequebook, write "CANCELLED" across it in big letters, and take a photo.',
        usualIssues: 'Some people use cheques that are already used. Needs to be a fresh, unused cheque with CANCELLED written on it.',
        details: [
          'Shows your name, account number, IFSC',
          'Required for GST registration',
          'Can use business or personal account',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Business Details',
    categoryNote: 'Information about your business',
    items: [
      {
        icon: <Briefcase size={14} />,
        name: 'Business Name',
        note: 'trade name for your business',
        whatIsIt: 'The name customers will see on your invoices and shop board. Can be your own name or a trade name.',
        howToGet: 'Just decide what you want to call your business. Keep it professional and easy to remember.',
        usualIssues: 'Don\'t use "Pvt Ltd" or "LLP" in the name - that\'s illegal for sole proprietorships.',
        details: [
          'Name under which you\'ll do business',
          'Can include your name or a trade name',
          'Should be unique in your locality',
          'Used for GST registration and invoicing',
        ],
        required: true,
      },
      {
        icon: <Globe size={14} />,
        name: 'Business Description',
        note: 'nature of goods/services offered',
        whatIsIt: 'What do you sell or what services do you provide? This helps determine your GST category and the right HSN/SAC codes.',
        howToGet: 'Write a simple line about your business: "Trading of electronic goods" or "Freelance software development services".',
        usualIssues: 'Being too vague or too specific. Be clear but broad enough to cover your actual business.',
        details: [
          'What products or services you offer',
          'Helps determine HSN/SAC codes for GST',
          'Main business activity description',
        ],
        required: true,
      },
      {
        icon: <MapPin size={14} />,
        name: 'Principal Place of Business',
        note: 'main business location address',
        whatIsIt: 'The primary location where your business operates. This address appears on your GST certificate and all invoices.',
        howToGet: 'Your office or shop address. If working from home, use your home address. Make sure it matches your utility bill exactly.',
        usualIssues: 'Address format mismatches. If your utility bill says "Flat 12, Tower A" write it exactly the same way.',
        details: [
          'Primary location where business is conducted',
          'Will appear on GST certificate',
          'Can add additional places later',
        ],
        required: true,
      },
      {
        icon: <FileText size={14} />,
        name: 'Business Activity and HSN/SAC Codes',
        note: 'description of goods or services and their HSN/SAC codes - needed for GST registration',
        whatIsIt: 'When registering for GST, you must declare what goods or services you sell and their corresponding HSN or SAC codes. These codes determine your GST rate.',
        howToGet: 'Write out in simple terms what your business sells. Ollvy maps this to the correct HSN/SAC code.',
        usualIssues: 'Getting the HSN/SAC code wrong means your invoices show the wrong GST rate - leading to mismatches.',
        details: [
          'Required for declaring your principal place of business and business activity',
          'SAC code for services (e.g., 998314 for IT consulting)',
          'HSN code for goods (e.g., 6403 for leather footwear)',
          'Multiple codes can be added if you sell diverse products/services',
          'Ollvy identifies the correct codes - just describe your business',
          'Correct code ensures correct GST rate on your invoices',
        ],
        required: true,
      },
    ],
  },
]
```

---

## 5. Individual ITR Documents (`individualITRDocuments`)

```typescript
export const individualITRDocuments: DocumentCategory[] = [
  {
    category: 'Income Documents',
    categoryNote: 'Proof of all your income sources',
    items: [
      {
        icon: <FileText size={14} />,
        name: 'PAN Card',
        note: 'mandatory for filing - and must be linked with Aadhaar',
        whatIsIt: 'PAN is your taxpayer ID - it is how the Income Tax Department tracks every rupee of income, TDS deducted on your behalf, and taxes paid. ITR filing is done under your PAN.',
        howToGet: 'You almost certainly already have a PAN. If not, apply at NSDL or UTIITSL. Before filing, ensure PAN is linked with Aadhaar at incometax.gov.in.',
        usualIssues: 'PAN-Aadhaar linkage is the #1 issue that stops people from filing. Check it early.',
        details: [
          'Mandatory for all ITR filings - filing is not possible without PAN',
          'PAN must be linked with Aadhaar - check at incometax.gov.in before filing',
          'Inoperative PAN (not linked with Aadhaar) cannot be used for filing from July 2023',
          'Linking PAN with Aadhaar costs ₹1,000 late fee if done after June 30, 2023',
          'Name change after marriage: update PAN name to match bank and employer records',
        ],
        required: true,
      },
      {
        icon: <User size={14} />,
        name: 'Aadhaar Card',
        note: 'for e-verification of return - Aadhaar OTP is the fastest way to verify',
        whatIsIt: 'Aadhaar is used for e-verification of your filed ITR. After filing, you must verify the return within 30 days or it is considered invalid.',
        howToGet: 'Keep your Aadhaar and the mobile number linked to it ready. You do not need to submit a scan - just have it accessible for the OTP step.',
        usualIssues: 'If the mobile linked to Aadhaar is an old number, e-verification via OTP will fail. Use net banking-based e-verification instead.',
        details: [
          'Not submitted as a document - used for e-verification only',
          'Mobile number linked to Aadhaar must be active for OTP',
          'If Aadhaar OTP method unavailable, use net banking EVC as alternative',
          'Return must be e-verified within 30 days of filing - otherwise treated as non-filed',
          'Physical ITR-V (alternative to e-verification) must be sent to CPC Bengaluru',
        ],
        required: true,
      },
      {
        icon: <FileSpreadsheet size={14} />,
        name: 'Form 16',
        note: 'TDS certificate from employer - issued annually by June 15',
        whatIsIt: 'Form 16 is a TDS certificate issued by your employer showing: total salary paid, total TDS deducted, and a breakdown of all exemptions and deductions.',
        howToGet: 'Your employer must issue Form 16 by June 15 every year. Ask your HR or payroll team if you haven\'t received it.',
        usualIssues: 'If Form 16 amounts don\'t match your Form 26AS, get the discrepancy corrected with your employer before filing.',
        details: [
          'Part A: generated from TRACES portal, shows quarterly TDS deposits',
          'Part B: employer-generated, shows salary breakup and deductions',
          'Employer must issue Form 16 by June 15 for the previous financial year',
          'Changed jobs? Get Form 16 from each employer separately',
          'Cross-verify amounts with Form 26AS - mismatches must be resolved before filing',
          'Not mandatory if no TDS was deducted (income below threshold) - use salary slips instead',
        ],
        required: true,
      },
      {
        icon: <Receipt size={14} />,
        name: 'Salary Slips (Last 3 Months)',
        note: 'useful if Form 16 is not yet received or if perquisites need verification',
        whatIsIt: 'Monthly salary slips from your employer show your gross salary, deductions, and net take-home for each month.',
        howToGet: 'Download from your company\'s HRMS portal or request from your HR/payroll team.',
        usualIssues: 'Slips from March sometimes don\'t reflect final TDS adjustments - use Form 16 to reconcile.',
        details: [
          'Last 3 months is sufficient for verification purposes',
          'Download from your company HRMS portal or request from payroll',
          'Not officially submitted to IT department - reference document for filing',
          'Needed when Form 16 not yet available or for verifying specific perquisites',
          'Cross-check variable pay, bonuses, and arrears against Form 26AS',
        ],
        required: false,
      },
      {
        icon: <CreditCard size={14} />,
        name: 'Bank Statements (All Accounts)',
        note: 'all savings and current accounts active during the financial year',
        whatIsIt: 'Bank statements are needed to: declare interest income, verify salary credits, reconcile unexplained credits that AIS might flag.',
        howToGet: 'Download 12-month statements (April-March) from each bank\'s net banking portal.',
        usualIssues: 'Savings account interest is often overlooked and not declared - the IT department now cross-checks this via AIS.',
        details: [
          'Include all savings, current, salary, and NRE/NRO accounts active during the year',
          '12-month statement April to March for the relevant financial year',
          'Savings account interest above ₹10,000 is taxable - declare it',
          'FD interest must be declared even if not withdrawn',
          'Download from net banking - most banks provide annual PDF statement in one click',
          'Accounts with zero transactions can be skipped - all others must be included',
        ],
        required: true,
      },
      {
        icon: <Landmark size={14} />,
        name: 'Bank Interest Certificate / Form 16A',
        note: 'for FD interest and TDS deducted on deposits - issued by your bank',
        whatIsIt: 'If your bank has deducted TDS on fixed deposit interest, the bank issues Form 16A as a TDS certificate.',
        howToGet: 'Download from your bank\'s internet banking portal under "Tax" or "Certificates" section.',
        usualIssues: 'Many people overlook interest certificates for small FDs - even ₹5,000 of unreported interest can trigger a notice.',
        details: [
          'Form 16A: issued by bank when TDS was deducted on FD interest',
          'Interest Certificate: issued by bank for savings/FD interest (when no TDS deducted)',
          'Download from net banking under Tax/Certificates section',
          'Available on TRACES portal using bank\'s TAN',
          'Cross-check with AIS on IT portal - AIS pre-populates bank-reported interest',
          'Senior citizens (age 60+): TDS on FD starts above ₹50,000 interest (not ₹40,000)',
        ],
        required: false,
      },
      {
        icon: <FileCheck size={14} />,
        name: 'Form 26AS and Annual Information Statement (AIS)',
        note: 'download both from incometax.gov.in - cross-verify with all other documents',
        whatIsIt: 'Form 26AS shows all TDS deducted on your behalf. AIS is the newer, more comprehensive version including mutual fund transactions, stock trades, property sales, etc.',
        howToGet: 'Log in to incometax.gov.in using your PAN. Go to e-File > Income Tax Returns > View Form 26AS. AIS: go to Services > Annual Information Statement.',
        usualIssues: 'If an employer has deducted TDS but not deposited it, it won\'t appear in 26AS - follow up with employer.',
        details: [
          'Download from incometax.gov.in - completely free, no third party needed',
          'Form 26AS: TDS, advance tax, refunds - traditional tax summary',
          'AIS: adds mutual funds, stocks, dividends, property, bank interest, crypto',
          'Submit AIS feedback for incorrect entries before filing',
          'If TDS in 26AS is lower than TDS on your Form 16 - employer has not deposited - contact them immediately',
          'Cross-verify 26AS figures with each Form 16 before handing to CA',
        ],
        required: true,
      },
      {
        icon: <Building2 size={14} />,
        name: 'Rental Income Proof',
        note: 'rent receipts or agreement - if you receive rent from any property',
        whatIsIt: 'If you own a property and rent it out, the rental income must be declared under "Income from House Property."',
        howToGet: 'Collect rent receipts from tenants or the rental agreement showing the monthly rent.',
        usualIssues: 'Rental income declared by you must match what appears in your tenant\'s TDS filing.',
        details: [
          'Rent receipts or rental agreement showing monthly rent amount',
          'If tenant deducts TDS on rent: obtain Form 16C from the tenant',
          'Municipal tax paid receipts (for deduction against rental income)',
          'Home loan statement if claiming interest deduction on let-out property',
          'TDS on rent applies when rent exceeds ₹50,000/month (tenant obligation)',
        ],
        required: false,
      },
    ],
  },
  {
    category: 'Deduction Proofs',
    categoryNote: 'Documents for claiming tax deductions - old tax regime only',
    items: [
      {
        icon: <Shield size={14} />,
        name: '80C Investment Proofs',
        note: 'up to ₹1.5 lakh deduction - only available if you choose old tax regime',
        whatIsIt: 'Section 80C allows a deduction of up to ₹1.5 lakh per year from taxable income for investments in specified instruments.',
        howToGet: 'Collect statements for whatever 80C investments you have made: ELSS statement, PPF passbook, EPF statement, life insurance premium receipts, etc.',
        usualIssues: 'The most common mistake is assuming EPF contributions automatically count toward 80C even in the new regime - they do not.',
        details: [
          'Maximum ₹1.5 lakh per year across all 80C investments combined',
          'Available ONLY in old tax regime - not available in new tax regime (default from AY 2024-25)',
          'ELSS: mutual fund statement from fund house or CAMS/KFintech',
          'PPF: passbook or statement showing deposits made April-March',
          'EPF: your own contribution (not employer\'s) shown in EPFO statement',
          'Life insurance premium: annual premium receipts',
          'Home loan principal: bank certificate showing principal repaid in the year',
        ],
        required: false,
      },
      {
        icon: <Home size={14} />,
        name: 'Home Loan Statement',
        note: 'interest certificate from lender - for Section 24(b) deduction',
        whatIsIt: 'If you have a home loan, you can deduct the interest paid under Section 24(b): up to ₹2 lakh per year for self-occupied property.',
        howToGet: 'Download from your bank\'s home loan section on net banking, or request from the loan branch.',
        usualIssues: 'For under-construction properties, interest during construction period can be claimed in 5 equal installments after possession.',
        details: [
          'Get "Home Loan Interest Certificate" from your bank - shows principal and interest for the FY',
          'Section 24(b): deduct interest paid - ₹2 lakh limit for self-occupied, unlimited for let-out',
          'Section 80C: deduct principal repaid - within the ₹1.5 lakh overall limit (old regime only)',
          'Pre-EMI interest (during construction): claim in 5 equal installments after possession',
          'Joint home loan: each co-borrower can claim deduction proportional to their ownership',
          'Available in both old and new tax regimes for self-occupied property (Section 24(b))',
        ],
        required: false,
      },
      {
        icon: <Shield size={14} />,
        name: 'Health Insurance Premium (Section 80D)',
        note: 'for self, spouse, children, and parents - premium receipts from insurer',
        whatIsIt: 'Section 80D allows deduction of health insurance premium paid: up to ₹25,000 for self and family, additional ₹25,000/₹50,000 for parents.',
        howToGet: 'Get the annual premium receipt from your health insurance company.',
        usualIssues: 'Premium paid in cash is not eligible for 80D deduction - must be paid digitally or by cheque.',
        details: [
          'Maximum deduction: ₹25,000 for self+family + ₹25,000/₹50,000 for parents',
          'Premium must be paid digitally - cash payment not eligible for 80D deduction',
          'Preventive health check-up: up to ₹5,000 (included within the overall limit)',
          'Old tax regime only - not available in new tax regime',
          'Get premium receipt from insurer or employer certificate for group policy',
          'Parents must be separately covered under the policy to claim the additional limit',
        ],
        required: false,
      },
      {
        icon: <FileCheck size={14} />,
        name: 'Donation Receipts (Section 80G)',
        note: '50% or 100% deduction depending on recipient',
        whatIsIt: 'Donations to approved charitable organisations are deductible under Section 80G.',
        howToGet: 'Get Form 10BE from the NGO - this is the official donor certificate.',
        usualIssues: 'Donations in cash above ₹2,000 are not eligible.',
        details: [
          'Get Form 10BE from the NGO - it is now the mandatory donor certificate',
          'Donation must be via cheque, NEFT, or UPI - cash above ₹2,000 not eligible',
          'Check NGO\'s 80G registration validity at incometax.gov.in before claiming',
          '100% deduction: PM Relief Fund, National Defence Fund, etc. (no cap)',
          '50% deduction: most other approved NGOs (capped at 10% of adjusted gross income)',
          'Old tax regime only - donations are not deductible in new tax regime',
        ],
        required: false,
      },
    ],
  },
  {
    category: 'Capital Gains Documents',
    categoryNote: 'If you sold shares, property, or other assets',
    items: [
      {
        icon: <TrendingUp size={14} />,
        name: 'Stock Trading Statements (Capital Gains)',
        note: 'Profit and Loss statement from your broker',
        whatIsIt: 'If you have traded in stocks, ETFs, or derivatives, you need a Capital Gains Statement from your broker showing each transaction.',
        howToGet: 'Download the Capital Gains / P&L Report from your broker\'s platform: Zerodha (Console), Groww, Upstox, Angel One etc.',
        usualIssues: 'Brokers show capital gains in calendar year - ensure you download the financial year (April-March) version.',
        details: [
          'Download P&L or Capital Gains Statement from your broker for the financial year (Apr-Mar)',
          'Major brokers: Zerodha (Console), Groww (Reports), Upstox, Angel One all provide this',
          'LTCG (>12 months): 12.5% above ₹1.25 lakh per year (Budget 2024 rate)',
          'STCG (<12 months): 20% flat rate on equity/equity mutual funds',
          'F&O losses: carry forward for 8 years, requires ITR-3 filing',
          'ESOP: separate statement from employer\'s equity admin platform',
        ],
        required: false,
      },
      {
        icon: <TrendingUp size={14} />,
        name: 'Mutual Fund Statements (Capital Gains)',
        note: 'consolidated statement from CAMS or KFintech',
        whatIsIt: 'If you redeemed any mutual funds during the year, capital gains need to be declared.',
        howToGet: 'Go to camsonline.com or kfintech.com, enter your PAN, and download the CAS for the financial year.',
        usualIssues: 'Many people confuse "SIP dividend" with redemption - dividends are taxable separately.',
        details: [
          'Download CAS from CAMS (camsonline.com) or KFintech (kfintech.com) using your PAN',
          'Includes all mutual fund transactions across all AMCs in one statement',
          'Equity/equity-hybrid MF: LTCG at 12.5% (>12 months), STCG at 20% (<12 months)',
          'Debt MF (units bought after April 1, 2023): taxed at slab rate regardless of holding',
          'Dividend income from MF: taxable at slab rate, pre-populated in AIS',
          'ELSS redemption after 3-year lock-in: LTCG',
        ],
        required: false,
      },
      {
        icon: <Building2 size={14} />,
        name: 'Property Sale Documents',
        note: 'sale deed, cost of acquisition, and stamp duty value',
        whatIsIt: 'If you sold a property during the financial year, capital gains arise.',
        howToGet: 'Gather the original purchase deed, the sale deed, and the stamp duty circle rate for the property.',
        usualIssues: 'If you inherited the property, cost of acquisition is the Fair Market Value as of April 1, 2001 - you need a registered valuer\'s certificate.',
        details: [
          'Original purchase deed with date and cost - needed to compute acquisition cost',
          'Sale deed with date and sale price',
          'TDS certificate Form 16B from buyer (if sale value >= ₹50 lakh)',
          'Stamp duty circle rate at time of sale - from state registration portal',
          'For inherited property: registered valuer\'s certificate of FMV as of April 1, 2001',
          'Tax saving options: Section 54 (invest in another home), Section 54EC (bonds)',
        ],
        required: false,
      },
      {
        icon: <FileText size={14} />,
        name: 'Previous Year ITR Acknowledgment',
        note: 'ITR-V from last year - for carry-forward losses and continuity',
        whatIsIt: 'The ITR-V from your previous year\'s filing is useful for carrying forward capital losses and verifying continuity.',
        howToGet: 'Log in to incometax.gov.in, go to e-File > Income Tax Returns > View Filed Returns. Download the ITR-V.',
        usualIssues: 'If last year\'s return was not e-verified, it is treated as not filed - carried-forward losses are lost.',
        details: [
          'Download ITR-V from incometax.gov.in > e-File > View Filed Returns',
          'Required for claiming carried-forward capital or business losses',
          'Confirms last year\'s return was successfully filed and verified',
          'Carry-forward losses are forfeited if the loss year return was not filed before due date',
          'Also useful for cross-checking last year\'s figures if income patterns are similar',
        ],
        required: false,
      },
    ],
  },
]
```

---

## 6. Business ITR Documents (`businessITRDocuments`)

```typescript
export const businessITRDocuments: DocumentCategory[] = [
  {
    category: 'Identity and Signing',
    categoryNote: 'For the entity and the signing director/partner',
    items: [
      {
        icon: <FileText size={14} />,
        name: 'Entity PAN Card',
        note: 'company or LLP PAN - different from promoter personal PAN',
        whatIsIt: 'Every company and LLP has its own PAN, separate from the directors\' or partners\' personal PANs. The business ITR is filed under the entity PAN.',
        howToGet: 'The entity PAN was issued by MCA at the time of incorporation. Download from the IT portal or locate the original PAN card.',
        usualIssues: 'Filing ITR under the wrong PAN (personal instead of entity or vice versa) is a common mistake for new founders.',
        details: [
          'Separate PAN for company/LLP/partnership - not the promoter\'s personal PAN',
          'Entity PAN is used for: ITR filing, GST, TDS deductions, bank accounts',
          'If lost: apply for reprint at NSDL/UTIITSL',
          'Link entity PAN with TAN if you deduct TDS',
        ],
        required: true,
      },
      {
        icon: <User size={14} />,
        name: 'Aadhaar of Signing Director/Partner',
        note: 'for e-verification of ITR - OTP will be sent to the signatory\'s Aadhaar-linked mobile',
        whatIsIt: 'Business ITR is signed and e-verified by an authorised signatory. The signatory\'s Aadhaar is required for Aadhaar OTP-based e-verification.',
        howToGet: 'The signing director/partner keeps their Aadhaar accessible for OTP. The mobile linked to Aadhaar must be active.',
        usualIssues: 'If the signing director\'s Aadhaar has an old mobile linked, Aadhaar OTP will fail. Use DSC-based signing instead.',
        details: [
          'Aadhaar of the individual signing the ITR (director/partner)',
          'Mobile linked to Aadhaar must be active for OTP',
          'Alternative: e-verify via DSC (Digital Signature Certificate)',
          'Companies typically use DSC for signing instead of Aadhaar OTP',
        ],
        required: true,
      },
      {
        icon: <Shield size={14} />,
        name: 'DSC of Signing Director/Partner',
        note: 'Class 3 DSC for signing ITR and tax audit report - Ollvy can procure if needed',
        whatIsIt: 'A Digital Signature Certificate (Class 3) is mandatory for signing business ITRs filed by companies and LLPs.',
        howToGet: 'If you already have a DSC from company incorporation, reuse it. If expired or not available, Ollvy procures a new DSC.',
        usualIssues: 'Expired DSCs cause last-minute scrambles during ITR filing deadlines. Check DSC validity by August.',
        details: [
          'Class 3 DSC mandatory for company/LLP ITR and tax audit filings',
          'Must be in the name of the signing director/partner',
          'Valid for 2 years - check expiry before ITR season',
          'If expired: Ollvy procures a new one with video KYC',
          'DSC from incorporation can be reused if still valid',
        ],
        required: true,
        ollvyProvides: true,
      },
    ],
  },
  {
    category: 'Financial Statements',
    categoryNote: 'Audited financials for the financial year',
    items: [
      {
        icon: <FileSpreadsheet size={14} />,
        name: 'Audited Balance Sheet',
        note: 'signed by auditor and directors - as of March 31',
        whatIsIt: 'The Balance Sheet shows the financial position of your company or LLP as of March 31 - assets, liabilities, and equity.',
        howToGet: 'Your statutory auditor prepares this. Provide the auditor with: trial balance, bank statements, fixed asset register, loan statements.',
        usualIssues: 'Last-minute audits cause poor-quality financial statements. Start the audit process by July.',
        details: [
          'Shows assets, liabilities, equity as of March 31',
          'Mandatory audit under Companies Act 2013 / LLP Act 2008',
          'Signed by directors and statutory auditor',
          'Submit to MCA via AOC-4 and use for ITR filing',
          'Start audit by July - deadline is September 30 for tax audit',
        ],
        required: true,
      },
      {
        icon: <FileSpreadsheet size={14} />,
        name: 'Profit and Loss Statement',
        note: 'audited P&L for the year - revenue, expenses, net profit/loss',
        whatIsIt: 'The Profit and Loss Statement shows the company\'s financial performance for the year.',
        howToGet: 'Your statutory auditor prepares this alongside the balance sheet.',
        usualIssues: 'Revenue per P&L must reconcile with revenue reported in GSTR-3B and GSTR-9.',
        details: [
          'Shows revenue, expenses, net profit/loss for the financial year',
          'Audited alongside balance sheet by statutory auditor',
          'Signed by directors and auditor',
          'P&L profit is starting point for tax computation',
          'Revenue must reconcile with GSTR-3B and GSTR-9',
        ],
        required: true,
      },
      {
        icon: <FileText size={14} />,
        name: 'Notes to Accounts',
        note: 'accounting policies and disclosures - part of audited financials',
        whatIsIt: 'Notes to Accounts are the detailed explanations accompanying the Balance Sheet and P&L.',
        howToGet: 'Your auditor prepares the notes as part of the audit.',
        usualIssues: 'Incomplete related party disclosures are a common audit qualification.',
        details: [
          'Accounting policies: revenue recognition, depreciation, inventory valuation',
          'Related party transactions disclosure mandatory',
          'Contingent liabilities and commitments',
          'Statutory disclosures under Schedule III (Companies Act)',
          'Prepared by auditor as part of statutory audit',
        ],
        required: true,
      },
      {
        icon: <Calculator size={14} />,
        name: 'Trial Balance',
        note: 'year-end trial balance - basis for preparing financial statements',
        whatIsIt: 'A Trial Balance is the list of all ledger account balances as of year-end (March 31).',
        howToGet: 'Export from your accounting software: Tally, Zoho Books, QuickBooks. Export as Excel or PDF for March 31.',
        usualIssues: 'Unreconciled bank balances or suspense accounts in the trial balance delay audits.',
        details: [
          'List of all ledger balances as of March 31',
          'Export from Tally, Zoho Books, QuickBooks, or your accounting software',
          'Must balance: total debits = total credits',
          'Clean up suspense accounts and reconcile bank before sharing',
          'Include previous year trial balance for comparatives',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Tax Documents',
    categoryNote: 'TDS, advance tax, and credit statements',
    items: [
      {
        icon: <Receipt size={14} />,
        name: 'Form 26AS and AIS',
        note: 'download from incometax.gov.in - cross-verify against GST returns and financial statements',
        whatIsIt: 'The entity\'s PAN-linked Form 26AS and AIS show: TDS deducted on business receipts, advance tax paid, and high-value transactions.',
        howToGet: 'Log in to incometax.gov.in using the entity\'s PAN credentials.',
        usualIssues: 'If a client has deducted TDS but not deposited it, it won\'t appear in 26AS - chase the client.',
        details: [
          'Download under entity\'s PAN (not promoter personal PAN)',
          'All client-deducted TDS must appear in 26AS for claiming credit in ITR',
          'Check for any TDS mismatch with invoices raised',
          'AIS: check for SFT entries - high-value cash transactions and property sales',
          'Advance tax challans paid must match 26AS - verify challan numbers',
        ],
        required: true,
      },
      {
        icon: <FileCheck size={14} />,
        name: 'TDS Certificates (Form 16A)',
        note: 'from clients who deducted TDS on payments to your business',
        whatIsIt: 'When a company pays you for services above ₹30,000 per year, they issue Form 16A after deducting TDS.',
        howToGet: 'Chase your top clients for Form 16A in May-June after year-end.',
        usualIssues: 'Some clients issue Form 16A with incorrect PAN - this means the TDS credit does not appear in your 26AS.',
        details: [
          'Issued by clients who deducted TDS on payments to your business',
          'Must show your entity\'s correct PAN - wrong PAN means no credit in 26AS',
          'Available from TRACES portal using deductor\'s TAN',
          'Cross-check against 26AS - if 26AS shows TDS entry, Form 16A is optional',
          'Request from all clients in May-June for the previous financial year',
        ],
        required: false,
      },
      {
        icon: <Calculator size={14} />,
        name: 'Advance Tax Challans',
        note: 'proof of advance tax payments made during the year',
        whatIsIt: 'Businesses with tax liability above ₹10,000 per year must pay advance tax in quarterly instalments.',
        howToGet: 'Each advance tax payment via the IT portal generates a challan receipt - save all four.',
        usualIssues: 'A common error is paying advance tax under the wrong head (wrong PAN).',
        details: [
          'Four quarterly installments: June 15, September 15, December 15, March 15',
          'Challan 280 receipt generated for each payment - save all receipts',
          'Also visible in Form 26AS - cross-verify against challans held',
          'Ensure payment is under entity PAN, not promoter personal PAN',
          'Late payment: Section 234C interest at 1% per month on shortfall',
        ],
        required: false,
      },
      {
        icon: <Calculator size={14} />,
        name: 'Tax Computation (CA Prepared)',
        note: 'prepared by Ollvy\'s CA based on financial statements provided',
        whatIsIt: 'Tax computation bridges accounting profit and taxable income with appropriate adjustments.',
        howToGet: 'Nothing to provide - Ollvy prepares the tax computation using all documents you have supplied.',
        usualIssues: 'Key items to check: depreciation rates per IT rules, Section 40A(3) cash disallowances.',
        details: [
          'Prepared entirely by Ollvy\'s CA - nothing to supply',
          'Bridges accounting profit and taxable income',
          'Key adjustments: IT depreciation vs accounting depreciation, Section 40A(3), exempt income',
          'Shared with you for review before ITR is filed',
          'Retain copy for at least 7 years - needed during IT assessments',
        ],
        required: false,
        ollvyProvides: true,
      },
    ],
  },
  {
    category: 'Books of Accounts',
    categoryNote: 'Maintained mandatorily under Section 44AA',
    items: [
      {
        icon: <BookOpen size={14} />,
        name: 'Books of Accounts (Cash Book, Ledger)',
        note: 'maintained mandatorily under Section 44AA - digital or physical',
        whatIsIt: 'Section 44AA requires businesses to maintain specified books of accounts: cash book, ledger, journal, copies of bills.',
        howToGet: 'Export your books from your accounting software for the financial year.',
        usualIssues: 'Businesses that maintain no books and reconstruct them only for ITR are at high risk during scrutiny.',
        details: [
          'Mandatory under Section 44AA above specified income/turnover thresholds',
          'Digital records (Tally, Zoho Books, QuickBooks) satisfy the requirement',
          'Must be retained for 6 years from end of assessment year',
          'For presumptive taxation (Section 44AD/44ADA): full books not mandatory',
          'Cash transactions above ₹10,000 per day per person are disallowed',
          'Tax audit required when turnover > ₹1 Crore (or ₹10 Crore if 95%+ digital)',
        ],
        required: true,
      },
      {
        icon: <FileCheck size={14} />,
        name: 'Tax Audit Report (Form 3CA/3CB + Form 3CD)',
        note: 'mandatory when turnover exceeds ₹1 Crore - prepared by CA',
        whatIsIt: 'The Tax Audit Report is mandatory under Section 44AB when business turnover exceeds ₹1 Crore.',
        howToGet: 'Ollvy\'s CA prepares Forms 3CA/3CB and 3CD based on your audited financial statements.',
        usualIssues: 'Clause 44 of Form 3CD requires a detailed GST reconciliation - sales per books must match GSTR-3B filed.',
        details: [
          'Mandatory: business turnover > ₹1 Crore, or profession gross receipts > ₹50 lakh',
          'Optional 44AB threshold: ₹10 Crore if 95%+ receipts and payments are digital',
          'Form 3CA: used when entity is already audited under another law (Pvt Ltd)',
          'Form 3CB: used for entities not audited under any other law (partnership, proprietorship)',
          'Form 3CD: mandatory with both - 44 clauses of detailed financial particulars',
          'UDIN mandatory - verifiable on ICAI website',
          'Deadline: September 30 (one month before ITR deadline of October 31)',
        ],
        required: false,
        ollvyProvides: true,
      },
      {
        icon: <Calculator size={14} />,
        name: 'Depreciation Schedule',
        note: 'for businesses with capital assets - IT depreciation rates differ from Companies Act',
        whatIsIt: 'Businesses claim depreciation on fixed assets under Section 32 of the Income Tax Act.',
        howToGet: 'Ollvy\'s CA prepares the IT depreciation computation from your asset register.',
        usualIssues: 'Assets put to use for less than 180 days in the year get only 50% of the full-year depreciation rate.',
        details: [
          'IT depreciation rates differ from accounting rates - separate schedule needed',
          'Block-based depreciation: group assets by type (computers at 40%, furniture at 10%)',
          'New asset put to use < 180 days in the year: only 50% of the normal rate applies',
          'Sale of asset: excess sale value over WDV creates a taxable gain',
          'Computers and peripherals: 40% per year, software: 40%',
          'Ollvy\'s CA prepares the IT depreciation computation from your asset register',
        ],
        required: false,
      },
    ],
  },
  {
    category: 'GST Records',
    categoryNote: 'For reconciliation with income',
    items: [
      {
        icon: <Receipt size={14} />,
        name: 'GSTR-3B Summary',
        note: 'all 12 months filed - for Clause 44 reconciliation',
        whatIsIt: 'GSTR-3B is the monthly summary GST return showing your turnover, output tax liability, ITC claimed, and net tax paid.',
        howToGet: 'Download GSTR-3B summaries for all 12 months from gst.gov.in.',
        usualIssues: 'Common reconciliation differences: credit notes, advances received, export invoices.',
        details: [
          'Download from gst.gov.in > Returns > View Filed Returns',
          'All 12 months required for full-year reconciliation',
          'Turnover in GSTR-3B must match revenue in P&L (or differences explained)',
          'Clause 44 of Form 3CD requires GST vs books reconciliation',
          'Export invoices, credit notes, advances are common reconciliation items',
        ],
        required: true,
      },
      {
        icon: <FileText size={14} />,
        name: 'GSTR-9 Annual Return',
        note: 'annual GST return - mandatory for businesses with turnover above ₹2 Crore',
        whatIsIt: 'GSTR-9 is the annual GST return consolidating all monthly GSTR-3B data.',
        howToGet: 'If already filed, download from gst.gov.in > Returns > Annual Return > GSTR-9.',
        usualIssues: 'Differences between GSTR-9 and GSTR-3B figures require explanation.',
        details: [
          'Annual GST return due by December 31',
          'Mandatory for turnover > ₹2 Crore',
          'Consolidates all GSTR-3B and GSTR-1 data for the year',
          'Cross-referenced with ITR during assessment',
          'Optional for turnover <= ₹2 Crore (check current notification)',
        ],
        required: false,
      },
      {
        icon: <FileSpreadsheet size={14} />,
        name: 'GST Reconciliation Statement (GSTR-9C)',
        note: 'mandatory for turnover above ₹5 Crore - reconciles audited P&L with GST returns',
        whatIsIt: 'GSTR-9C reconciles: turnover as per audited P&L vs turnover per GSTR-9, ITC as per books vs ITC claimed.',
        howToGet: 'Ollvy\'s CA prepares GSTR-9C based on your audited financial statements and GST portal data.',
        usualIssues: 'The most common reconciliation difference is timing - invoices raised but payment not yet received.',
        details: [
          'Mandatory only for turnover above ₹5 Crore',
          'Reconciles audited turnover with GSTR turnover',
          'Filed alongside GSTR-9 by December 31',
          'Self-certification from FY 2020-21 - auditor sign optional but recommended',
          'Ollvy prepares based on your audited financials and GST portal data',
          'Legitimate differences (timing, advances) must be documented',
        ],
        required: false,
        ollvyProvides: true,
      },
    ],
  },
]
```

---

## 7. Trademark Registration Documents (`trademarkDocuments`)

```typescript
export const trademarkDocuments: DocumentCategory[] = [
  {
    category: 'Applicant Identity',
    categoryNote: 'Documents of the trademark owner',
    items: [
      {
        icon: <FileText size={14} />,
        name: 'PAN Card',
        note: 'of the individual / all directors (company) / all partners (firm)',
        whatIsIt: 'PAN is required to establish the identity of the trademark applicant. Name on PAN must exactly match the applicant name in Form TM-A.',
        howToGet: 'Photocopy or scan of PAN card. For online e-filing, a clear scanned JPEG or PDF is needed.',
        usualIssues: 'If the company name has changed since incorporation, the name change must be completed in MCA records before filing.',
        details: [
          'Individual/proprietor: personal PAN',
          'Company: signing director\'s PAN plus company PAN',
          'Partnership/LLP: authorised signatory\'s PAN',
          'Must match applicant name exactly in Form TM-A',
          'Scan as clear JPEG or PDF',
        ],
        required: true,
      },
      {
        icon: <User size={14} />,
        name: 'Aadhaar Card',
        note: 'of the applicant or authorised signatory - for identity verification',
        whatIsIt: 'Aadhaar is used as a secondary identity proof for trademark registration.',
        howToGet: 'Standard Aadhaar card scan (front and back). Active mobile linked to Aadhaar is needed.',
        usualIssues: 'Foreign nationals without Aadhaar: a passport and local address proof are accepted substitutes.',
        details: [
          'Scan front and back sides',
          'Active mobile linked to Aadhaar needed for OTP authentication on IP India portal',
          'Foreign nationals: passport in lieu of Aadhaar',
          'Not formally attached to TM-A but required for portal account and DSC',
        ],
        required: true,
      },
      {
        icon: <Home size={14} />,
        name: 'Address Proof',
        note: 'of the applicant - utility bill, bank statement, or Aadhaar',
        whatIsIt: 'The trademark application requires the applicant\'s address, and the Registry may ask for address proof during examination.',
        howToGet: 'The same address proof gathered for GST or company registration works here.',
        usualIssues: 'If the applicant\'s address on the application differs from the address proof, the Registry may raise an examination report.',
        details: [
          'Accepted: Aadhaar, utility bill (<60 days), bank statement (<60 days), voter ID, driving license',
          'Company applicants: COI serves as address proof',
          'Address must match the address on Form TM-A',
          'Aadhaar is the most convenient - it serves as both identity and address proof',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Business Entity Documents',
    categoryNote: 'If applying as company, LLP, or partnership',
    items: [
      {
        icon: <Building2 size={14} />,
        name: 'Certificate of Incorporation',
        note: 'for company or LLP applicants - establishes legal existence of the entity',
        whatIsIt: 'If a company or LLP is the trademark applicant, the Certificate of Incorporation proves the entity legally exists.',
        howToGet: 'Download from MCA portal (mca.gov.in > MCA Services > Get Documents > Download e-Documents).',
        usualIssues: 'Ensure the COI reflects the current company name if the company name has changed.',
        details: [
          'Required for companies, LLPs, and registered entities',
          'Download from MCA portal as PDF',
          'Company name on COI must exactly match applicant name in Form TM-A',
          'If company name recently changed: use latest COI reflecting new name',
          'Unregistered sole proprietors: not required - use proprietor identity documents',
        ],
        required: false,
      },
      {
        icon: <Gavel size={14} />,
        name: 'Form TM-48 (Power of Attorney)',
        note: 'authorises your trademark attorney or Ollvy to file on your behalf',
        whatIsIt: 'Form TM-48 is the official Power of Attorney form that authorises a trademark agent to file Form TM-A and represent the applicant.',
        howToGet: 'Ollvy prepares Form TM-48 pre-filled with your details. You sign and return it.',
        usualIssues: 'Using a generic PoA letter instead of Form TM-48 may be questioned during examination.',
        details: [
          'Prescribed form under Trademark Rules - not a general PoA',
          'Ollvy prepares and you sign - simple, 1-page document',
          'Authorises Ollvy\'s trademark agent to file and represent you before the Registry',
          'Mandatory when filing through an agent or attorney',
          'For companies: signed by authorised director, attach board resolution authorising them',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <FileCheck size={14} />,
        name: 'Board Resolution',
        note: 'for company applicants - authorises specific director to file trademark',
        whatIsIt: 'A board resolution authorises: (a) the company to apply for trademark registration, (b) a specific director to sign Form TM-48 and Form TM-A.',
        howToGet: 'Ollvy provides the draft board resolution. Directors pass it at a board meeting or by circulation.',
        usualIssues: 'For startups, a circular resolution signed by both founders is the fastest approach.',
        details: [
          'Ollvy provides the standard board resolution draft',
          'Passed at board meeting or by circular resolution (all directors sign)',
          'Must authorise the company to apply for trademark and the specific director to sign',
          'No ROC filing required - internal corporate record',
          'Not required for sole director companies or individual applicants',
        ],
        required: false,
        ollvyProvides: true,
      },
      {
        icon: <ScrollText size={14} />,
        name: 'Partnership Deed',
        note: 'only for partnership firms applying as trademark applicant',
        whatIsIt: 'If a partnership firm is the trademark applicant, the partnership deed establishes the firm\'s legal identity.',
        howToGet: 'Use the existing partnership deed. A notarised copy of the deed is acceptable.',
        usualIssues: 'Unregistered firms are a common applicant type in India - the deed itself is sufficient.',
        details: [
          'Required for partnership firm applicants only',
          'Both registered and unregistered partnership deeds are accepted',
          'Must show firm name matching applicant name in TM-A',
          'Identify the authorised partner who will sign the application',
          'Notarised copy acceptable for unregistered firms',
        ],
        required: false,
      },
      {
        icon: <BadgeCheck size={14} />,
        name: 'MSME / Udyam Registration Certificate',
        note: 'halves the trademark filing fee from ₹9,000 to ₹4,500 per class',
        whatIsIt: 'If your business is registered as an MSME, you pay half the trademark filing fee.',
        howToGet: 'Download your Udyam Registration Certificate from udyamregistration.gov.in.',
        usualIssues: 'The Udyam certificate must show the applicant entity as the MSME.',
        details: [
          'Reduces filing fee from ₹9,000 to ₹4,500 per class - significant savings for multi-class',
          'Download from udyamregistration.gov.in using your Udyam number',
          'Free to register if business qualifies (MSMEs and startups)',
          'DPIIT startup recognition certificate provides the same fee benefit',
          'Entity on Udyam certificate must match trademark applicant name',
        ],
        required: false,
      },
    ],
  },
  {
    category: 'Trademark Details',
    categoryNote: 'What you want to protect',
    items: [
      {
        icon: <Globe size={14} />,
        name: 'Brand Name (Word Mark)',
        note: 'the exact word or phrase you want to protect',
        whatIsIt: 'The word mark is the text you want to register as a trademark - your brand name, company name, product name, or tagline.',
        howToGet: 'Simply provide the exact text you want to protect. Make sure the spelling is exactly as you want it protected.',
        usualIssues: 'Filing a mark that is too descriptive or generic results in objection or rejection.',
        details: [
          'Exact text to protect - spell it precisely, capitalisation as intended',
          'No TM or R symbols in the submission text',
          'Protects the words in any font, color, or style',
          'Ollvy performs trademark search before filing to check for conflicts',
          'Too-descriptive marks may be objected - "Best Compliance" would face objection',
          'A TM symbol can be used immediately after application is filed (before registration)',
        ],
        required: true,
      },
      {
        icon: <Palette size={14} />,
        name: 'Logo File',
        note: 'if registering a logo or device mark - JPEG format, 8x8 cm, high resolution',
        whatIsIt: 'If you want to protect your logo, you can file a device mark or a combination mark (logo + text).',
        howToGet: 'Export your logo from Figma, Illustrator, Canva as a high-resolution JPEG (minimum 300 DPI, 8x8 cm).',
        usualIssues: 'Low-resolution logos (pixelated or blurry) are rejected by the Registry.',
        details: [
          'JPEG format, 8x8 cm, minimum 300 DPI',
          'Black and white (grayscale) preferred - covers all color versions',
          'Color mark: protects only those specific colors',
          'Export from design software at high resolution',
          'Can file both word mark and logo as separate applications for dual protection',
          'A separate application + fee is required for each mark (word mark != logo)',
        ],
        required: false,
      },
      {
        icon: <Briefcase size={14} />,
        name: 'Business Description and Trademark Class',
        note: 'describe your goods/services - Ollvy selects the correct Nice Classification class(es)',
        whatIsIt: 'India follows the Nice Classification system (45 classes) to categorise what a trademark covers.',
        howToGet: 'Describe in plain language: what you sell and to whom. Ollvy maps this to the correct class(es).',
        usualIssues: 'Filing in too few classes leaves your business unprotected in other areas.',
        details: [
          'Classes 1-34: goods. Classes 35-45: services.',
          'One fee per class per application',
          'Common tech/service company classes: 42 (SaaS/IT), 35 (business services), 45 (legal)',
          'Ollvy selects classes and writes the official Nice Classification description',
          'Wrong class = unprotected for that category of goods/services',
          'At minimum, file in the class most central to your primary business',
        ],
        required: true,
        ollvyProvides: true,
      },
    ],
  },
  {
    category: 'Legal and Filing',
    categoryNote: 'Ollvy handles these forms and filings',
    items: [
      {
        icon: <Shield size={14} />,
        name: 'DSC (Digital Signature Certificate)',
        note: 'Class 3 DSC required for online trademark e-filing on IP India portal',
        whatIsIt: 'For online trademark applications filed on the IP India portal, a Class 3 DSC is required.',
        howToGet: 'If you already have a DSC from Pvt Ltd incorporation, the same DSC is reused.',
        usualIssues: 'Expired DSCs cause e-filing to fail. Check DSC validity before filing.',
        details: [
          'Required for e-filing on IP India portal - avoids in-person filing at Registry',
          'E-filing gives instant acknowledgment and TM usage right immediately',
          'If you already have a DSC from Pvt Ltd registration: reuse the same DSC',
          'DSC must be in applicant\'s name (individual) or authorised signatory (company)',
          'Valid for 2 years - check expiry before filing',
          'Ollvy procures DSC if you don\'t have one',
        ],
        required: true,
        ollvyProvides: true,
      },
      {
        icon: <FileSignature size={14} />,
        name: 'User Affidavit (Claim of Prior Use)',
        note: 'only if claiming prior use of the mark - establishes earlier date of use',
        whatIsIt: 'If you have been using your trademark in commerce before filing, you can claim a "prior use" date.',
        howToGet: 'Collect evidence of first use: earliest invoice with the brand name, website screenshots, advertisements.',
        usualIssues: 'Claiming a prior use date without adequate evidence is risky.',
        details: [
          'File only if you have actual documentary evidence of prior use',
          'Evidence: invoices, packaging, website screenshots, advertisements with the brand name',
          'Affidavit must be sworn before a Notary Public - notarisation required',
          'Ollvy prepares the affidavit draft - you sign before a Notary',
          'Prior use claim helps in opposition proceedings if a competitor files a similar mark',
          'Do not fabricate use dates - this is perjury and grounds for trademark cancellation',
        ],
        required: false,
      },
      {
        icon: <Search size={14} />,
        name: 'Trademark Search Report',
        note: 'Ollvy performs this before filing - identifies conflicting marks in the same class',
        whatIsIt: 'Ollvy performs a comprehensive search on the IP India database to check for conflicting marks.',
        howToGet: 'Ollvy conducts this search automatically as part of the trademark filing process.',
        usualIssues: 'A search showing no identical marks is reassuring but not a guarantee - similar marks can still cause objection.',
        details: [
          'Ollvy performs this as part of the filing process - no action needed from you',
          'Searches for identical and similar marks in your target class(es)',
          'Not submitted to Registry - internal pre-filing diligence',
          'Clean search does not guarantee registration - Registry retains discretion',
          'Ollvy shares the search report and risk assessment before you approve the filing',
        ],
        required: false,
        ollvyProvides: true,
      },
    ],
  },
]
```

---

## 8. Sole Proprietorship Documents (`soleProprietorDocuments`)

```typescript
export const soleProprietorDocuments: DocumentCategory[] = [
  {
    category: 'Identity Documents',
    categoryNote: 'Your personal KYC documents - you ARE the business',
    items: [
      {
        icon: <FileText size={14} />,
        name: 'PAN Card',
        note: 'your personal PAN - becomes your business PAN',
        whatIsIt: 'In a sole proprietorship, you and the business are legally the same entity. Your personal PAN is your business PAN - there is no separate company PAN.',
        howToGet: 'Use your existing personal PAN card. Take a clear photo where all text is readable. If you do not have PAN, apply at incometax.gov.in.',
        usualIssues: 'PAN must be linked with Aadhaar for GST registration to work. Check linkage at incometax.gov.in before starting.',
        details: [
          'Clear colored scan of your personal PAN card',
          'Your personal PAN = business PAN for sole proprietorship',
          'Must be linked with Aadhaar for GST registration',
          'All business income is filed under your personal ITR',
          'Check PAN-Aadhaar linkage before starting any registration',
        ],
        required: true,
      },
      {
        icon: <User size={14} />,
        name: 'Aadhaar Card',
        note: 'front and back - mobile must be linked for OTP verification',
        whatIsIt: 'Your 12-digit Aadhaar proves your identity. OTPs will be sent to the mobile linked to your Aadhaar during GST and Udyam registration.',
        howToGet: 'Scan or photo both sides. Verify your mobile is linked at myaadhaar.uidai.gov.in.',
        usualIssues: 'Wrong mobile number is the #1 blocker. Verify and update first.',
        details: [
          'Both sides of Aadhaar card',
          'Mobile number must be active for OTP verification',
          'Required for GST, Udyam, and Shop Act registration',
        ],
        required: true,
      },
      {
        icon: <Camera size={14} />,
        name: 'Passport-size Photo',
        note: 'recent, white background - required for GST registration',
        whatIsIt: 'Standard passport photo for GST registration. This appears on your GST certificate.',
        howToGet: 'Any photo studio (Rs. 50-100). Ask for "passport size, white background."',
        usualIssues: 'Old photos or selfies get rejected. The photo should be recent (within 6 months).',
        details: [
          'Recent photograph (within 6 months)',
          'White background, professional attire',
          'Required for GST registration',
        ],
        required: true,
      },
      {
        icon: <User size={14} />,
        name: 'Email ID and Mobile Number',
        note: 'active email and Indian mobile for OTP - used across all registrations',
        whatIsIt: 'GST, Udyam, and Shop Act registration all require email and mobile verification.',
        howToGet: 'Use your active personal or business email and Indian mobile number.',
        usualIssues: 'If the mobile or email is not immediately accessible for OTP, registration stalls.',
        details: [
          'One email and mobile for all registrations',
          'Must be active for real-time OTP verification',
          'Indian mobile number required - foreign numbers not accepted',
          'You will receive compliance reminders and notices on these',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Business Address Proof',
    categoryNote: 'Where your business operates from',
    items: [
      {
        icon: <Home size={14} />,
        name: 'Utility Bill',
        note: 'electricity/water bill of business premises - can be home if working from home',
        whatIsIt: 'Proves where your business operates. For sole proprietors working from home, your home electricity bill works perfectly.',
        howToGet: 'Find your latest electricity or water bill. Download from utility provider\'s app or check your email for e-bills.',
        usualIssues: 'Address on the bill must exactly match the address entered in registration forms.',
        details: [
          'Recent utility bill (within 2 months)',
          'Can be residential if running business from home',
          'In your name or with NOC from owner',
          'Address must match registration form exactly',
        ],
        required: true,
      },
      {
        icon: <ScrollText size={14} />,
        name: 'Rent Agreement',
        note: 'if operating from rented premises - notarized preferred',
        whatIsIt: 'If you are renting office or shop space, this proves you have legal permission to operate from that address.',
        howToGet: 'Get a standard rent agreement from your landlord. Notarized is better.',
        usualIssues: 'Expired agreements cause rejections. Check the end date.',
        details: [
          'Lease/rent agreement for business premises',
          'Should mention commercial/business use',
          'Notarized copy preferred',
        ],
        required: false,
      },
      {
        icon: <FileCheck size={14} />,
        name: 'NOC from Owner',
        note: 'if utility bill not in your name',
        whatIsIt: 'A letter from the property owner saying "I consent to this person running their business from my property."',
        howToGet: 'We provide a template. Fill it in, get the owner to sign, attach their Aadhaar copy.',
        usualIssues: 'Forgetting to attach owner\'s ID proof.',
        details: [
          'Property owner\'s consent letter',
          'Required if bills are in owner\'s name',
          'Template provided by Ollvy',
        ],
        required: false,
        ollvyProvides: true,
      },
    ],
  },
  {
    category: 'Bank Details',
    categoryNote: 'For business verification and current account opening',
    items: [
      {
        icon: <CreditCard size={14} />,
        name: 'Bank Statement',
        note: 'last 3 months - personal savings account works initially',
        whatIsIt: 'Shows your banking activity. GST registration needs this to verify you are a real business. You can use your personal savings account.',
        howToGet: 'Download from net banking: Statements, Last 3 months, Download PDF.',
        usualIssues: 'Account with zero transactions looks suspicious.',
        details: [
          'Latest 3 months bank statement',
          'Shows regular transactions',
          'Personal savings account works for GST registration',
          'Current account can be opened after GST registration',
        ],
        required: true,
      },
      {
        icon: <Banknote size={14} />,
        name: 'Cancelled Cheque',
        note: 'from your bank account - shows account details',
        whatIsIt: 'A cheque leaf with "CANCELLED" written on it. Shows your account number, IFSC code, and name.',
        howToGet: 'Take a cheque from your chequebook, write "CANCELLED" across it, and take a photo.',
        usualIssues: 'Needs to be a fresh, unused cheque with CANCELLED written on it.',
        details: [
          'Shows your name, account number, IFSC',
          'Required for GST registration',
          'Fresh unused cheque with CANCELLED written',
        ],
        required: true,
      },
    ],
  },
  {
    category: 'Business Details',
    categoryNote: 'Information about your proprietorship',
    items: [
      {
        icon: <Briefcase size={14} />,
        name: 'Business Name (Trade Name)',
        note: 'the name your business operates under',
        whatIsIt: 'The name customers will see on your invoices and shop board. Can be your own name or a trade name.',
        howToGet: 'Decide what you want to call your business. Keep it professional and easy to remember.',
        usualIssues: 'Do not use "Pvt Ltd", "LLP", or "Limited" in the name - that is illegal for sole proprietorships.',
        details: [
          'Name under which you will do business',
          'Can include your name or a trade name',
          'Should be unique in your locality',
          'Do not use "Pvt Ltd" or "Limited" in the name',
        ],
        required: true,
      },
      {
        icon: <Globe size={14} />,
        name: 'Business Description',
        note: 'nature of goods/services you offer',
        whatIsIt: 'What do you sell or what services do you provide? This helps determine your GST category and the right HSN/SAC codes.',
        howToGet: 'Write a simple description: "Trading of electronic goods" or "Freelance software development services".',
        usualIssues: 'Being too vague or too specific.',
        details: [
          'What products or services you offer',
          'Helps determine HSN/SAC codes for GST',
          'Main business activity description',
        ],
        required: true,
      },
      {
        icon: <MapPin size={14} />,
        name: 'Principal Place of Business',
        note: 'main business location - appears on your GST certificate',
        whatIsIt: 'The primary location where your business operates. This address appears on your GST certificate and all invoices.',
        howToGet: 'Your office or shop address. If working from home, use your home address.',
        usualIssues: 'Address format mismatches.',
        details: [
          'Primary location where business is conducted',
          'Will appear on GST certificate',
          'Can add additional places later',
        ],
        required: true,
      },
    ],
  },
]
```

---

# Part 2: Penalty Calculator Infrastructure

**Source:** `/ollvy/apps/customer/lib/penalty-calculator/`

---

## types.ts

```typescript
/**
 * Penalty Calculator Types
 * TypeScript interfaces for the compliance risk calculator
 */

export type BusinessType = 'pvt_ltd' | 'llp' | 'partnership' | 'sole_proprietor' | 'not_registered'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface CalculatorInputs {
  businessType: BusinessType
  gstRegistered: boolean
  annualTurnover: number // in lakhs
  hasEmployees: boolean
  employeeCount: number
  daysLate: number
  outstandingTax: number // in rupees
  selectedCompliances: string[] // slugs of selected compliances
}

export interface PenaltyBreakdown {
  slug: string
  serviceName: string
  dueDate: string | null
  daysLate: number
  penaltyAmount: number
  interestAmount: number
  totalAmount: number
  statute: string
  explanation: string
  serviceSlug: string // for the "Fix This" button link
}

export interface CalculationResult {
  totalPenalty: number
  totalInterest: number
  totalExposure: number
  riskLevel: RiskLevel
  penalties: PenaltyBreakdown[]
}

export interface ComplianceOption {
  slug: string
  label: string
  description: string
  condition: (inputs: CalculatorInputs) => boolean
}
```

---

## constants.ts

```typescript
/**
 * Penalty Calculator Constants
 * Thresholds and regulatory limits for compliance calculations
 */

// GST registration thresholds (in lakhs)
export const GST_THRESHOLD_GOODS = 40 // ₹40 lakhs for goods
export const GST_THRESHOLD_SERVICES = 20 // ₹20 lakhs for services

// Employee thresholds
export const PF_THRESHOLD_EMPLOYEES = 20 // PF mandatory above 20 employees
export const ESIC_THRESHOLD_EMPLOYEES = 10 // ESIC mandatory above 10 employees

// Turnover thresholds (in lakhs)
export const ITR_HIGH_PENALTY_THRESHOLD = 500 // ₹5 Cr - above this, ITR penalty is ₹10,000
export const GSTR9_MANDATORY_THRESHOLD = 200 // ₹2 Cr - GSTR-9 mandatory

// Risk level thresholds (in rupees)
export const RISK_LEVEL_LOW_MAX = 10000 // Up to ₹10,000
export const RISK_LEVEL_MEDIUM_MAX = 50000 // ₹10,001 - ₹50,000
export const RISK_LEVEL_HIGH_MAX = 200000 // ₹50,001 - ₹2,00,000
// Above ₹2L is critical

// Penalty rates
export const GST_LATE_FEE_PER_DAY = 100 // ₹100/day (CGST+SGST combined = ₹200/day, but we use per return)
export const GST_INTEREST_RATE = 0.18 // 18% annual on outstanding tax
export const MCA_LATE_FEE_PER_DAY = 200 // ₹100 AOC-4 + ₹100 MGT-7 = ₹200/day combined
export const DIRECTOR_KYC_FLAT_PENALTY = 5000 // ₹5,000 flat
export const ITR_LOW_PENALTY = 1000 // ₹1,000 if turnover < ₹5Cr
export const ITR_HIGH_PENALTY = 10000 // ₹10,000 if turnover >= ₹5Cr
export const ITR_INTEREST_RATE = 0.01 // 1% per month
export const TDS_LATE_FEE_PER_DAY = 200 // ₹200/day for late return
export const TDS_INTEREST_RATE = 0.015 // 1.5% per month on late deposits
export const PF_INTEREST_RATE = 0.12 // 12% annual
export const PF_DEFAULT_PENALTY = 5000 // ₹5,000 per default event
export const ESIC_INTEREST_RATE = 0.12 // 12% annual (same as PF)
export const ESIC_DEFAULT_PENALTY = 5000 // ₹5,000 per default

// Service slugs (for linking to service pages)
export const SERVICE_SLUGS = {
  gst: 'gst-monthly',
  mca: 'mca-annual-filing',
  directorKyc: 'director-kyc',
  itr: 'business-itr',
  tds: 'tds-monthly-compliance',
  pf: 'pf-registration',
  esic: 'esi-registration',
} as const
```

---

## engine.ts

```typescript
/**
 * Penalty Calculator Engine
 * Core calculation logic for compliance risk assessment
 */

import {
  type CalculatorInputs,
  type CalculationResult,
  type PenaltyBreakdown,
  type RiskLevel,
  type ComplianceOption,
} from './types'
import {
  GST_LATE_FEE_PER_DAY,
  GST_INTEREST_RATE,
  MCA_LATE_FEE_PER_DAY,
  DIRECTOR_KYC_FLAT_PENALTY,
  ITR_LOW_PENALTY,
  ITR_HIGH_PENALTY,
  ITR_HIGH_PENALTY_THRESHOLD,
  ITR_INTEREST_RATE,
  TDS_LATE_FEE_PER_DAY,
  TDS_INTEREST_RATE,
  PF_INTEREST_RATE,
  PF_DEFAULT_PENALTY,
  PF_THRESHOLD_EMPLOYEES,
  ESIC_INTEREST_RATE,
  ESIC_DEFAULT_PENALTY,
  ESIC_THRESHOLD_EMPLOYEES,
  SERVICE_SLUGS,
  RISK_LEVEL_LOW_MAX,
  RISK_LEVEL_MEDIUM_MAX,
  RISK_LEVEL_HIGH_MAX,
} from './constants'

/**
 * Get the current Indian financial year (April to March)
 * Returns the calendar year in which the financial year starts
 * e.g., FY 2025-26 returns 2025
 */
function getCurrentFinancialYear(): number {
  const now = new Date()
  const currentMonth = now.getMonth() // 0-11
  const currentYear = now.getFullYear()

  // Financial year starts in April (month 3)
  // If we're in Jan-Mar, we're still in the previous FY
  return currentMonth < 3 ? currentYear - 1 : currentYear
}

/**
 * Get due dates for the current financial year
 * Dynamically calculates dates based on FY instead of hardcoding
 */
function getDueDates(): Record<string, string> {
  const fy = getCurrentFinancialYear()
  const nextYear = fy + 1

  return {
    // Annual compliances - due in the same calendar year as FY start
    'business-itr': `${fy}-10-31`, // October 31 of FY start year
    'gst-annual-return': `${fy}-12-31`, // December 31 of FY start year
    'director-kyc': `${fy}-09-30`, // September 30 of FY start year
    'mca-annual-filing': `${fy}-10-30`, // 30 days after AGM (assumed Sep 30)

    // Monthly compliances - use next month's date relative to current date
    // These are rolling dates, shown as example for the first month of FY
    'tds-monthly-compliance': getNextMonthlyDueDate(7), // 7th of following month
    'gst-monthly': getNextMonthlyDueDate(20), // 20th of following month
    'pf-compliance': getNextMonthlyDueDate(15), // 15th of following month
    'esic-compliance': getNextMonthlyDueDate(15), // 15th of following month
  }
}

/**
 * Get the next monthly due date for a compliance with a specific day
 */
function getNextMonthlyDueDate(dayOfMonth: number): string {
  const now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1 // Next month

  // If we're past the due date this month, use next month
  if (now.getDate() >= dayOfMonth) {
    month++
  }

  // Handle year rollover
  if (month > 12) {
    month = 1
    year++
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`
}

// Get due dates dynamically
const DUE_DATES = getDueDates()

/**
 * Available compliance options based on business profile
 */
export const COMPLIANCE_OPTIONS: ComplianceOption[] = [
  {
    slug: 'gst',
    label: 'GST Filing (GSTR-3B / GSTR-1)',
    description: 'Monthly GST returns',
    condition: (inputs) => inputs.gstRegistered,
  },
  {
    slug: 'mca',
    label: 'MCA Annual Filing (AOC-4 + MGT-7)',
    description: 'Company annual returns',
    condition: (inputs) => ['pvt_ltd', 'llp'].includes(inputs.businessType),
  },
  {
    slug: 'director-kyc',
    label: 'Director KYC (DIR-3 KYC)',
    description: 'Annual director verification',
    condition: (inputs) => ['pvt_ltd', 'llp'].includes(inputs.businessType),
  },
  {
    slug: 'itr',
    label: 'Business ITR',
    description: 'Annual income tax return',
    condition: (inputs) => inputs.businessType !== 'not_registered',
  },
  {
    slug: 'tds',
    label: 'TDS Compliance',
    description: 'Monthly TDS deposits and quarterly returns',
    condition: (inputs) =>
      inputs.hasEmployees || ['pvt_ltd', 'llp', 'partnership'].includes(inputs.businessType),
  },
  {
    slug: 'pf',
    label: 'PF Compliance',
    description: 'Monthly PF contributions',
    condition: (inputs) => inputs.hasEmployees && inputs.employeeCount >= PF_THRESHOLD_EMPLOYEES,
  },
  {
    slug: 'esic',
    label: 'ESIC Compliance',
    description: 'Monthly ESIC contributions',
    condition: (inputs) => inputs.hasEmployees && inputs.employeeCount >= ESIC_THRESHOLD_EMPLOYEES,
  },
]

/**
 * Get applicable compliances based on business profile
 */
export function getApplicableCompliances(inputs: CalculatorInputs): ComplianceOption[] {
  return COMPLIANCE_OPTIONS.filter((option) => option.condition(inputs))
}

/**
 * Calculate GST filing penalty
 */
function calculateGstPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!inputs.gstRegistered) return null
  if (!inputs.selectedCompliances.includes('gst')) return null

  const penaltyAmount = GST_LATE_FEE_PER_DAY * inputs.daysLate
  // Interest on outstanding tax (18% annual, prorated)
  const interestAmount = Math.round(
    inputs.outstandingTax * GST_INTEREST_RATE * (inputs.daysLate / 365)
  )

  return {
    slug: 'gst',
    serviceName: 'GST Monthly Filing',
    dueDate: DUE_DATES['gst-monthly'],
    daysLate: inputs.daysLate,
    penaltyAmount,
    interestAmount,
    totalAmount: penaltyAmount + interestAmount,
    statute: 'CGST Act 2017, Section 47',
    explanation: `Late fee of ₹100/day per return (CGST+SGST combined). ${inputs.outstandingTax > 0 ? `Plus 18% annual interest on ₹${inputs.outstandingTax.toLocaleString('en-IN')} outstanding tax.` : ''}`,
    serviceSlug: SERVICE_SLUGS.gst,
  }
}

/**
 * Calculate MCA annual filing penalty
 */
function calculateMcaPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!['pvt_ltd', 'llp'].includes(inputs.businessType)) return null
  if (!inputs.selectedCompliances.includes('mca')) return null

  const penaltyAmount = MCA_LATE_FEE_PER_DAY * inputs.daysLate

  return {
    slug: 'mca',
    serviceName: 'MCA Annual Filing',
    dueDate: DUE_DATES['mca-annual-filing'],
    daysLate: inputs.daysLate,
    penaltyAmount,
    interestAmount: 0,
    totalAmount: penaltyAmount,
    statute: 'Companies Act 2013, Sections 92 and 137',
    explanation: 'AOC-4 due within 30 days of AGM, MGT-7 within 60 days. Both attract ₹100/day penalty (combined ₹200/day).',
    serviceSlug: SERVICE_SLUGS.mca,
  }
}

/**
 * Calculate Director KYC penalty
 */
function calculateDirectorKycPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!['pvt_ltd', 'llp'].includes(inputs.businessType)) return null
  if (!inputs.selectedCompliances.includes('director-kyc')) return null

  return {
    slug: 'director-kyc',
    serviceName: 'Director KYC (DIR-3 KYC)',
    dueDate: DUE_DATES['director-kyc'],
    daysLate: inputs.daysLate,
    penaltyAmount: DIRECTOR_KYC_FLAT_PENALTY,
    interestAmount: 0,
    totalAmount: DIRECTOR_KYC_FLAT_PENALTY,
    statute: 'Companies Act 2013, Section 155',
    explanation: 'Flat ₹5,000 penalty for late filing. DIN gets deactivated, blocking all MCA filings until DIR-3 KYC is filed.',
    serviceSlug: SERVICE_SLUGS.directorKyc,
  }
}

/**
 * Calculate Business ITR penalty
 */
function calculateItrPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (inputs.businessType === 'not_registered') return null
  if (!inputs.selectedCompliances.includes('itr')) return null

  // Penalty based on turnover
  const penaltyAmount = inputs.annualTurnover >= ITR_HIGH_PENALTY_THRESHOLD
    ? ITR_HIGH_PENALTY
    : ITR_LOW_PENALTY

  // Interest: 1% per month on outstanding tax
  const monthsLate = Math.ceil(inputs.daysLate / 30)
  const interestAmount = Math.round(inputs.outstandingTax * ITR_INTEREST_RATE * monthsLate)

  return {
    slug: 'itr',
    serviceName: 'Business ITR',
    dueDate: DUE_DATES['business-itr'],
    daysLate: inputs.daysLate,
    penaltyAmount,
    interestAmount,
    totalAmount: penaltyAmount + interestAmount,
    statute: 'Income Tax Act 1961, Section 234F',
    explanation: `Flat penalty of ₹${penaltyAmount.toLocaleString('en-IN')} for late filing${inputs.annualTurnover >= ITR_HIGH_PENALTY_THRESHOLD ? ' (turnover >= ₹5Cr)' : ' (turnover < ₹5Cr)'}. ${inputs.outstandingTax > 0 ? `Plus 1%/month interest on ₹${inputs.outstandingTax.toLocaleString('en-IN')} unpaid tax.` : ''}`,
    serviceSlug: SERVICE_SLUGS.itr,
  }
}

/**
 * Calculate TDS penalty
 */
function calculateTdsPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  const applicable = inputs.hasEmployees || ['pvt_ltd', 'llp', 'partnership'].includes(inputs.businessType)
  if (!applicable) return null
  if (!inputs.selectedCompliances.includes('tds')) return null

  const penaltyAmount = TDS_LATE_FEE_PER_DAY * inputs.daysLate
  // 1.5% per month on outstanding TDS
  const monthsLate = Math.ceil(inputs.daysLate / 30)
  const interestAmount = Math.round(inputs.outstandingTax * TDS_INTEREST_RATE * monthsLate)

  return {
    slug: 'tds',
    serviceName: 'TDS Compliance',
    dueDate: DUE_DATES['tds-monthly-compliance'],
    daysLate: inputs.daysLate,
    penaltyAmount,
    interestAmount,
    totalAmount: penaltyAmount + interestAmount,
    statute: 'Income Tax Act 1961, Section 234E',
    explanation: `₹200/day late fee for delayed 24Q/26Q return. ${inputs.outstandingTax > 0 ? `Plus 1.5%/month interest on ₹${inputs.outstandingTax.toLocaleString('en-IN')} late TDS deposit.` : ''} 40% expense disallowance possible.`,
    serviceSlug: SERVICE_SLUGS.tds,
  }
}

/**
 * Calculate PF penalty
 */
function calculatePfPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!inputs.hasEmployees || inputs.employeeCount < PF_THRESHOLD_EMPLOYEES) return null
  if (!inputs.selectedCompliances.includes('pf')) return null

  // Estimate monthly PF contribution (basic salary ~ ₹15,000/employee x 12% x employees)
  const estimatedMonthlyPf = Math.round(15000 * 0.12 * inputs.employeeCount)
  const interestAmount = Math.round(estimatedMonthlyPf * PF_INTEREST_RATE * (inputs.daysLate / 365))

  return {
    slug: 'pf',
    serviceName: 'PF Compliance',
    dueDate: DUE_DATES['pf-compliance'],
    daysLate: inputs.daysLate,
    penaltyAmount: PF_DEFAULT_PENALTY,
    interestAmount,
    totalAmount: PF_DEFAULT_PENALTY + interestAmount,
    statute: 'EPF Act 1952, Section 14B',
    explanation: `₹5,000 flat penalty per default event. Plus 12% annual interest on delayed PF contributions (~₹${estimatedMonthlyPf.toLocaleString('en-IN')}/month estimated).`,
    serviceSlug: SERVICE_SLUGS.pf,
  }
}

/**
 * Calculate ESIC penalty
 */
function calculateEsicPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!inputs.hasEmployees || inputs.employeeCount < ESIC_THRESHOLD_EMPLOYEES) return null
  if (!inputs.selectedCompliances.includes('esic')) return null

  // Estimate monthly ESIC contribution (gross salary ~ ₹18,000/employee x 4% x employees)
  const estimatedMonthlyEsic = Math.round(18000 * 0.04 * inputs.employeeCount)
  const interestAmount = Math.round(estimatedMonthlyEsic * ESIC_INTEREST_RATE * (inputs.daysLate / 365))

  return {
    slug: 'esic',
    serviceName: 'ESIC Compliance',
    dueDate: DUE_DATES['esic-compliance'],
    daysLate: inputs.daysLate,
    penaltyAmount: ESIC_DEFAULT_PENALTY,
    interestAmount,
    totalAmount: ESIC_DEFAULT_PENALTY + interestAmount,
    statute: 'ESI Act 1948, Section 85',
    explanation: `₹5,000 flat penalty per default. Plus 12% annual interest on delayed ESIC contributions (~₹${estimatedMonthlyEsic.toLocaleString('en-IN')}/month estimated).`,
    serviceSlug: SERVICE_SLUGS.esic,
  }
}

/**
 * Determine risk level based on total exposure
 */
function getRiskLevel(totalExposure: number): RiskLevel {
  if (totalExposure <= RISK_LEVEL_LOW_MAX) return 'low'
  if (totalExposure <= RISK_LEVEL_MEDIUM_MAX) return 'medium'
  if (totalExposure <= RISK_LEVEL_HIGH_MAX) return 'high'
  return 'critical'
}

/**
 * Main calculation function
 */
export function calculatePenalties(inputs: CalculatorInputs): CalculationResult {
  const penalties: PenaltyBreakdown[] = []

  // Calculate each applicable penalty
  const gstPenalty = calculateGstPenalty(inputs)
  if (gstPenalty) penalties.push(gstPenalty)

  const mcaPenalty = calculateMcaPenalty(inputs)
  if (mcaPenalty) penalties.push(mcaPenalty)

  const directorKycPenalty = calculateDirectorKycPenalty(inputs)
  if (directorKycPenalty) penalties.push(directorKycPenalty)

  const itrPenalty = calculateItrPenalty(inputs)
  if (itrPenalty) penalties.push(itrPenalty)

  const tdsPenalty = calculateTdsPenalty(inputs)
  if (tdsPenalty) penalties.push(tdsPenalty)

  const pfPenalty = calculatePfPenalty(inputs)
  if (pfPenalty) penalties.push(pfPenalty)

  const esicPenalty = calculateEsicPenalty(inputs)
  if (esicPenalty) penalties.push(esicPenalty)

  // Sum up totals
  const totalPenalty = penalties.reduce((sum, p) => sum + p.penaltyAmount, 0)
  const totalInterest = penalties.reduce((sum, p) => sum + p.interestAmount, 0)
  const totalExposure = totalPenalty + totalInterest

  return {
    totalPenalty,
    totalInterest,
    totalExposure,
    riskLevel: getRiskLevel(totalExposure),
    penalties,
  }
}

/**
 * Format currency in Indian style
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
```

---

# Summary

This document contains the complete TypeScript code for:

## Part 1: Document Checklists (8 total)
1. **pvtLtdDocuments** - Private Limited Company incorporation
2. **llpDocuments** - LLP Incorporation
3. **partnershipDocuments** - Partnership Firm registration
4. **gstDocuments** - GST Registration
5. **individualITRDocuments** - Individual ITR Filing
6. **businessITRDocuments** - Business ITR Filing
7. **trademarkDocuments** - Trademark Registration
8. **soleProprietorDocuments** - Sole Proprietorship setup

## Part 2: Penalty Calculator Library (3 files)
1. **types.ts** - TypeScript interfaces
2. **constants.ts** - Thresholds and penalty rates
3. **engine.ts** - 7 calculate functions and COMPLIANCE_OPTIONS array

## Part 3: Penalty Calculator Components (10 total) - see allcontentcheck3.md, allcontentcheck4.md, allcontentcheck5.md
1. GSTLateFilingCalculator.tsx
2. DirectorKYCCalculator.tsx
3. MCAFilingCalculator.tsx
4. GSTDemandCalculator.tsx
5. ITRLateFilingCalculator.tsx
6. TDSLateFilingCalculator.tsx
7. PFESICCalculator.tsx
8. ProfessionalTaxCalculator.tsx
9. ShopsEstablishmentCalculator.tsx
10. StartupDPIITCalculator.tsx
