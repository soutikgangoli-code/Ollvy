// ─── COMPLETE BUSINESS PAN DOCUMENT CHECKLIST CONFIG ─────────────────────────
// Add this to lib/tools/document-checklist-pages.ts
// Follows the exact same schema as the other 8 checklists

export const businessPanChecklist = {
  slug: 'business-pan',
  title: 'Documents Required for Business PAN Registration',
  seoTitle: 'Documents for Business PAN Registration: Company, LLP and Firm (2025) | Ollvy',
  seoDescription: 'Complete document checklist for business PAN registration in India. Certificate of Incorporation, address proof, board resolution, and signatory KYC - by entity type.',
  canonicalUrl: 'https://www.ollvy.com/tools/documents/business-pan',
  lastReviewed: 'March 2026',
  relatedServiceSlug: 'business-pan',
  intro: 'NSDL requires proof of identity, address, and legal constitution for all business entities applying for PAN. Documents differ by entity type. Upload clear scanned copies in PDF or JPG format, each under 2MB.',

  sections: [
    {
      number: '01',
      heading: 'Private Limited Company, OPC, or LLP',
      items: [
        {
          name: 'Certificate of Incorporation',
          mandatory: true,
          description: 'Issued by MCA on the date of registration. Download the original digital copy from the MCA portal. Do not upload a photocopy of a physical certificate.',
        },
        {
          name: 'Memorandum of Association (MOA)',
          mandatory: true,
          description: 'Required for Private Limited and OPC only. Upload the complete MOA with all pages as filed with MCA. Not required for LLPs.',
        },
        {
          name: 'Articles of Association (AOA)',
          mandatory: true,
          description: 'Required for Private Limited and OPC only. Upload the complete AOA with all pages. Not required for LLPs.',
        },
        {
          name: 'LLP Agreement',
          mandatory: true,
          description: 'Required for LLPs only. The registered LLP Agreement filed with MCA. Must be the version stamped or accepted by MCA. Not required for Private Limited or OPC.',
        },
        {
          name: 'Registered Office Address Proof',
          mandatory: true,
          description: 'Any one of: electricity bill, telephone bill, broadband bill, water bill, or bank statement showing the registered office address. Must be less than 2 months old. If the office is rented, also upload the rent agreement along with the utility bill in the owner\'s name.',
        },
        {
          name: 'Board Resolution or Authorisation Letter',
          mandatory: true,
          description: 'A resolution authorising a specific director or designated partner to sign the PAN application on behalf of the company or LLP. Must be on company letterhead and signed by all directors or all designated partners. We will send you a template immediately after payment.',
        },
        {
          name: 'PAN Card of Authorised Signatory',
          mandatory: true,
          description: 'Copy of the personal PAN card of the director or designated partner signing the application.',
        },
        {
          name: 'Aadhaar Card of Authorised Signatory',
          mandatory: true,
          description: 'Both sides of the Aadhaar card of the authorised signatory. The name and date of birth on Aadhaar must match the PAN exactly. If there is any discrepancy, flag it to your CA before uploading.',
        },
      ],
    },
    {
      number: '02',
      heading: 'Partnership Firm',
      items: [
        {
          name: 'Partnership Deed',
          mandatory: true,
          description: 'The executed partnership deed with all pages, on stamp paper of the appropriate value for your state. If the firm is unregistered, the unregistered deed is acceptable but registration is recommended.',
        },
        {
          name: 'Certificate of Registration of Firm',
          mandatory: false,
          description: 'Issued by the Registrar of Firms. Required only if the firm is registered. Leave blank if the firm is unregistered.',
        },
        {
          name: 'Address Proof of Principal Place of Business',
          mandatory: true,
          description: 'Electricity bill, telephone bill, or bank statement for the firm\'s principal place of business. Must be less than 2 months old.',
        },
        {
          name: 'PAN Cards of All Partners',
          mandatory: true,
          description: 'Copy of the individual PAN card of each partner in the firm.',
        },
        {
          name: 'Aadhaar Card of Managing Partner',
          mandatory: true,
          description: 'Both sides of the Aadhaar card of the managing partner or the partner who will sign the application.',
        },
      ],
    },
    {
      number: '03',
      heading: 'Sole Proprietorship',
      items: [
        {
          name: 'Business Registration Proof',
          mandatory: true,
          description: 'Any one of the following: GST registration certificate, Shop and Establishment registration, MSME or Udyam registration certificate, or professional tax registration. This proves the business exists under the trade name.',
        },
        {
          name: 'Address Proof of Business Premises',
          mandatory: true,
          description: 'Electricity bill, telephone bill, or bank statement for the business address. Must be less than 2 months old.',
        },
        {
          name: 'PAN Card of Proprietor',
          mandatory: true,
          description: 'Copy of the proprietor\'s individual PAN card. Note: a sole proprietorship is not a separate legal entity. If you want a PAN in the business name rather than your personal name, this service covers that application.',
        },
        {
          name: 'Aadhaar Card of Proprietor',
          mandatory: true,
          description: 'Both sides of the proprietor\'s Aadhaar card.',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'My company was incorporated yesterday. Which documents do I need right now?',
      a: 'Certificate of Incorporation, MOA, AOA, and the authorised signatory\'s PAN and Aadhaar are the minimum. The address proof and board resolution can be uploaded within 24 hours of ordering. Your CA will tell you exactly what is missing after reviewing your uploads.',
    },
    {
      q: 'The registered office address proof is in the director\'s personal name, not the company name. Is that acceptable?',
      a: 'Yes, provided you also upload a No Objection Certificate (NOC) from the director confirming the company is permitted to use that address as its registered office. NSDL accepts this combination.',
    },
    {
      q: 'We do not have a board resolution yet. Can we start the process?',
      a: 'Yes. Upload all other documents first. We will send you a board resolution template immediately after payment. Once all directors sign it, upload it and your CA will proceed with submission.',
    },
    {
      q: 'The electricity bill at our registered office is in the previous tenant\'s name. What do I upload?',
      a: 'Upload the rent agreement (in your company\'s name) as the address proof instead. If the landlord can provide a NOC or an electricity bill in their own name for the same address, upload that alongside the rent agreement.',
    },
    {
      q: 'Do I need to upload physical originals or are digital scans accepted?',
      a: 'Digital scans and original digital documents (like the MCA-issued Certificate of Incorporation PDF) are accepted. Photographs taken on a phone are acceptable if they are clear, well-lit, and show all four corners of the document.',
    },
  ],

  sources: [
    {
      name: 'Income Tax Department - PAN Application Guide',
      url: 'https://www.incometax.gov.in/iec/foportal/help/how-to-apply-for-pan',
      description: 'Official IT department guide for PAN application process and document requirements',
    },
    {
      name: 'NSDL e-Gov PAN Portal',
      url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
      description: 'NSDL portal where Form 49A applications are submitted',
    },
    {
      name: 'Income Tax Act, 1961 (Section 139A)',
      url: 'https://www.incometax.gov.in',
      description: 'Statutory requirement for PAN for companies, LLPs, and firms',
    },
  ],
}
