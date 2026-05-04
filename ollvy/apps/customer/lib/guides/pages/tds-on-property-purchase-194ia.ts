// =============================================================================
// GUIDE PAGE: tds-on-property-purchase-194ia
// File path: lib/guides/pages/tds-on-property-purchase-194ia.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const tdsOnPropertyPurchase: LearnPageConfig = {
  slug: "tds-on-property-purchase-194ia",
  title: "TDS on Property Purchase: Section 194-IA and Form 26QB",
  seoTitle: "TDS on Property Purchase India 2026 | 1% Section 194-IA | Form 26QB | Ollvy",
  seoDescription:
    "Buying property over Rs 50L in India? Section 194-IA needs you to deduct 1% TDS and file Form 26QB within 30 days. Joint buyers, instalment payments, NRI sellers and the most common mistakes, all explained.",
  canonicalUrl: "https://www.ollvy.com/guides/tds-on-property-purchase-194ia",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["tds-quarterly-return"],
  relatedLearnSlugs: ["tds-on-rent-194i-194ib"],
  ctaServiceSlug: "tds-quarterly-return",
  sections: [
    {
      id: "01",
      heading: "WHAT SECTION 194-IA REQUIRES",
      body:
        "If you buy any immovable property in India (other than agricultural land) where the consideration or stamp duty value is Rs 50,00,000 or more, you, as the buyer, must deduct 1 percent TDS from the payment to the seller and remit it to the government. The seller doesn't deduct anything. The seller doesn't even handle the paperwork. The legal liability sits squarely on the buyer. Most first-time property buyers don't realize this until their CA flags it three months later, by which time the late fee is already running.",
    },
    {
      id: "02",
      heading: "WHO HAS TO DEDUCT AND WHO DOESN'T",
      body:
        "Section 194-IA applies to every buyer, individual, HUF, company, firm, anyone, regardless of whether you're tax audited or whether you have a TAN. That's deliberate. Unlike most TDS provisions which require a TAN, 194-IA lets you file using your PAN. The exemption list is short:",
      bullets: [
        "Property under Rs 50L (use stamp duty value if it's higher than the agreed consideration, that's the threshold under Finance Act 2022).",
        "Agricultural land (rural agricultural land, specifically, not urban farmhouses).",
        "Compulsory acquisition by the government (covered under Section 194LA instead).",
      ],
    },
    {
      id: "03",
      heading: "THE 1% IS DEDUCTED ON WHAT, EXACTLY",
      body:
        "TDS is 1 percent of the higher of (a) sale consideration, or (b) stamp duty value. So if you negotiated Rs 80L but the circle rate values it at Rs 95L, you deduct 1 percent on Rs 95L = Rs 95,000. If the seller doesn't have a PAN, the rate jumps to 20 percent under Section 206AA, which means you'd deduct Rs 19L on a Rs 95L property. Always insist on the seller's PAN before transferring any money.",
      table: {
        headers: ["Scenario", "TDS Rate", "TDS On"],
        rows: [
          ["Seller has PAN, sale > Rs 50L", "1%", "Higher of consideration or stamp duty value"],
          ["Seller has no PAN", "20%", "Higher of consideration or stamp duty value"],
          ["Sale below Rs 50L", "Nil", "Not applicable"],
          ["Agricultural land (rural)", "Nil", "Excluded from 194-IA"],
        ],
      },
    },
    {
      id: "04",
      heading: "FORM 26QB: HOW TO FILE",
      body:
        "Form 26QB is a challan-cum-statement combined into one. It's filed online on the TIN-NSDL portal. You need: PAN of buyer, PAN of seller, complete property address, total consideration, payment date, payment mode, and the TDS amount. Once you submit and pay (via internet banking or debit card), you generate Form 16B from the TRACES portal a few days later. Form 16B is the seller's TDS certificate, hand it to them as soon as it's available. They need it to claim credit while filing their own return.",
      note:
        "The deadline to file Form 26QB is 30 days from the end of the month in which TDS is deducted. So a payment made on May 10 means the deadline is June 30, not 30 days from May 10. Many buyers misread this and file at day 28 from the payment date, missing the actual end-of-month-plus-30 deadline.",
    },
    {
      id: "05",
      heading: "INSTALMENT PAYMENTS AND UNDER-CONSTRUCTION PROPERTY",
      body:
        "Most property purchases happen in instalments, especially under-construction flats with construction-linked plans. Each instalment triggers its own TDS event. So if you pay 20 percent at booking, 30 percent at slab, 30 percent at completion, and 20 percent at possession, you file Form 26QB four times, once per instalment. The 1 percent applies to each payment. Track this carefully because builders rarely remind you and the Income Tax Department's matching system will catch the mismatch eventually.",
    },
    {
      id: "06",
      heading: "JOINT BUYERS AND JOINT SELLERS",
      body:
        "When more than one person is named as buyer or seller, things get fiddly. The CBDT's official position (Circular No. 17/2014 and Notification 30/2016) is that each buyer-seller pair files a separate Form 26QB. So two buyers and one seller means two forms. Two buyers and two sellers means four forms. Each form covers the proportional share. If a husband and wife jointly buy a Rs 1Cr property from a single seller, with 50:50 ownership, each spouse files Form 26QB for their Rs 50,000 TDS share. Many builders' templates ignore this and ask for one combined form, which is technically wrong and causes credit-matching errors at the seller's end.",
    },
    {
      id: "07",
      heading: "BUYING FROM AN NRI SELLER",
      body:
        "Section 194-IA does not apply when the seller is a non-resident. Instead, Section 195 kicks in, and the rates are very different. For long-term capital gains (property held over 24 months), the Finance (No. 2) Act 2024 amended Section 112(1)(c) to apply a flat 12.5 percent rate (without indexation) on transfers on or after 23 July 2024 for non-residents (the resident-taxpayer optional 20 percent with indexation regime is not available to NRIs). For transfers up to 22 July 2024, the older 20 percent with indexation rate continued to apply. Adding the applicable surcharge (capped at 15 percent on LTCG since Budget 2022) and 4 percent health and education cess, the effective TDS on LTCG works out to approximately 14.95 percent at the base level and up to 23.92 percent at the highest surcharge slab. Short-term gains (property held 24 months or less) attract 30 percent plus surcharge and cess. The buyer must (until the law changes effective 1 October 2026, after which a PAN-based simplified process applies) obtain a TAN, file Form 27Q quarterly TDS returns, and issue Form 16A (not 16B) to the seller. The threshold of Rs 50L doesn't apply, even a Rs 10L property purchase from an NRI triggers TDS. The TDS is statutorily required on the entire sale consideration, not just the capital gain, unless the NRI seller obtains a Lower Deduction Certificate from the Assessing Officer in Form 13 in advance. This is the single biggest pitfall in NRI property transactions, and we strongly recommend involving a CA before signing the agreement to sell, not after.",
    },
    {
      id: "08",
      heading: "PENALTIES FOR GETTING IT WRONG",
      body:
        "Late filing or non-filing of Form 26QB is expensive:",
      bullets: [
        "Interest at 1 percent per month for late deduction (Section 201(1A)) and 1.5 percent per month for late deposit after deduction.",
        "Late filing fee under Section 234E: Rs 200 per day, capped at the TDS amount.",
        "Penalty under Section 271H: Rs 10,000 to Rs 1,00,000 for not filing Form 26QB within one year of the due date.",
        "If the entire amount is paid to the seller without TDS, the buyer may also be liable for the seller's tax under Section 201, which is the worst-case scenario.",
      ],
    },
  ],
  faqs: [
    {
      q: "I'm buying a Rs 60L flat. The builder said TDS is their problem. Should I trust that?",
      a: "No. Section 194-IA puts the legal obligation on the buyer, not the builder or seller. Many builders deduct on your behalf as a service, but they're acting as your agent. If the TDS isn't actually paid or Form 26QB is filed incorrectly, the Income Tax Department comes after you. Always confirm Form 16B was generated and matches your records before treating it as done.",
    },
    {
      q: "Do I need a TAN to file Form 26QB?",
      a: "No. Form 26QB is the only TDS provision in the Income Tax Act that lets you use PAN instead of TAN. That's by design, to make it accessible for ordinary buyers. Use your PAN to log in on TIN-NSDL or via the income tax e-filing portal.",
    },
    {
      q: "I forgot to deduct TDS at the time of payment. Can I deduct from the next instalment?",
      a: "No, the next instalment has its own TDS due. For the missed instalment, you have to either deduct from a future payment to the seller (rare, since most agreements are net of TDS already) or pay it from your own pocket and recover from the seller separately. Pay the missed amount with interest as soon as possible to stop the interest meter.",
    },
    {
      q: "The stamp duty value is higher than my agreed price. Which one do I use for TDS?",
      a: "The higher of the two. Finance Act 2022 amended Section 194-IA to require TDS on the higher of stamp duty value or sale consideration. So if you agreed Rs 70L but the circle rate values it at Rs 85L, deduct on Rs 85L. The seller will face capital gains tax on the higher figure too, under Section 50C.",
    },
    {
      q: "Does GST on under-construction property count for the Rs 50L threshold?",
      a: "No. The Rs 50L threshold and the TDS calculation are both on the base sale consideration excluding GST. So a flat with Rs 48L base price plus GST coming to Rs 53L total is below the threshold, no TDS applies. But check the agreement carefully, sometimes the base price itself crosses Rs 50L with GST shown separately.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act, Section 194-IA",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Statutory provision for 1% TDS on property purchase above Rs 50L.",
    },
    {
      name: "TIN-NSDL Form 26QB filing portal",
      url: "https://onlineservices.tin.egov-nsdl.com/etaxnew/tdsnontds.jsp",
      description: "Official portal for filing the property TDS challan-cum-statement.",
    },
    {
      name: "TRACES Portal: Form 16B download",
      url: "https://www.tdscpc.gov.in/app/login.xhtml",
      description: "Official portal to download the seller's TDS certificate after Form 26QB is filed.",
    },
    {
      name: "CBDT Circular No. 17/2014",
      url: "https://incometaxindia.gov.in/Communications/Circular/Circular%2017_2014.pdf",
      description: "Clarification on Form 26QB filing in cases of joint buyers and joint sellers.",
    },
  ],
};
