// =============================================================================
// GUIDE PAGE: iepf-claim
// File path: lib/guides/pages/iepf-claim.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const iepfClaim: LearnPageConfig = {
  slug: "iepf-claim",
  title: "IEPF Claim: How to Recover Unclaimed Shares and Dividends in India",
  seoTitle: "IEPF Claim Guide 2026 | Recover Unclaimed Shares and Dividends | Ollvy",
  seoDescription:
    "Step-by-step guide to recovering unclaimed shares, dividends, matured deposits and debentures from IEPF using Form IEPF-5. Documents, timelines, common rejections. Filed by Ollvy.",
  canonicalUrl: "https://www.ollvy.com/guides/iepf-claim",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["iepf-consultation"],
  relatedLearnSlugs: ["mca-annual-filing-aoc-4-mgt-7"],
  ctaServiceSlug: "pvt-ltd-incorporation",
  sections: [
    {
      id: "01",
      heading: "WHAT IEPF IS AND WHY IT MATTERS",
      body:
        "IEPF stands for Investor Education and Protection Fund. It's a government-administered fund where companies are required to transfer dividends, share application money, matured deposits, debentures and other amounts that have been unclaimed by their original investors for seven consecutive years. If you owned shares of a listed company at some point and didn't claim a dividend for seven years, those shares plus the accumulated unclaimed dividends can end up in IEPF, beyond your direct reach. The good news: you can claim them back using Form IEPF-5.",
    },
    {
      id: "02",
      heading: "WHAT GETS TRANSFERRED TO IEPF",
      body:
        "Section 124 and 125 of the Companies Act, 2013, plus the IEPF Authority Rules 2016, govern the transfer.",
      bullets: [
        "Dividends declared by a company that remain unpaid or unclaimed for seven years.",
        "Equity shares on which dividends have been unclaimed for seven consecutive years (yes, the shares themselves move to IEPF).",
        "Matured deposits and debentures that the holder has not claimed.",
        "Application money received against issuance of securities and not refunded.",
        "Interest accrued on any of the above.",
        "Sale proceeds of fractional shares arising from corporate actions.",
      ],
      note:
        "The shares transferred to IEPF are held by the IEPF Authority but the original beneficial owner can still claim them back. The transfer doesn't extinguish ownership rights, it just moves custody.",
    },
    {
      id: "03",
      heading: "WHO CAN FILE A CLAIM",
      body:
        "The original owner of the shares or dividends, the legal heir of a deceased owner, or in some cases the nominee or successor in title.",
      bullets: [
        "Original investor: file in your own name with the IEPF claim.",
        "Legal heir of deceased holder: requires succession certificate, will probate, or affidavit-based succession evidence.",
        "Nominee: where a registered nominee exists in the company records, the claim can be filed by the nominee directly.",
      ],
    },
    {
      id: "04",
      heading: "FORM IEPF-5: THE CLAIM PROCESS",
      body:
        "Form IEPF-5 is filed online through the MCA portal. The form is straightforward but the documentation behind it is where most claims get held up. The flow:",
      bullets: [
        "Login to MCA-21 portal and open Form IEPF-5.",
        "Fill in your particulars, the company name, the folio/DP-Client ID where shares were held, and the nature of the claim (dividend, shares, both).",
        "Attach the evidentiary documents (PAN, address proof, original share certificates if held in physical form, indemnity bond, advance receipt).",
        "Submit the form online with DSC or Aadhaar e-sign.",
        "Take a printout of the acknowledgement and dispatch it together with all original supporting documents to the company's registered office.",
        "The company verifies the claim and submits a verification report to IEPF Authority within 30 days.",
        "IEPF Authority processes the claim and credits the dividend amount to your bank account; shares are credited to your demat account.",
      ],
    },
    {
      id: "05",
      heading: "DOCUMENTS NEEDED",
      body:
        "Document discipline is the difference between a 60-day claim and a 6-month claim.",
      bullets: [
        "Self-attested PAN copy.",
        "Self-attested address proof (Aadhaar, passport, voter ID, electricity bill).",
        "Original share certificates (if shares were held in physical form). If lost, indemnity and lost certificate procedure first.",
        "Cancelled cheque of the bank account where dividend amount should be credited.",
        "Demat account details (DP ID, Client ID, name) where shares should be credited.",
        "Indemnity bond on stamp paper of appropriate value (state-dependent).",
        "Advance stamped receipt for the claim amount.",
        "For deceased holders: succession certificate, death certificate, legal heir documents, NOC from other heirs.",
      ],
    },
    {
      id: "06",
      heading: "TYPICAL TIMELINE",
      body:
        "From a clean Form IEPF-5 submission to actual credit, expect around 60 to 90 days. Breakdown:",
      table: {
        headers: ["Step", "Timeline", "Owner"],
        rows: [
          ["Document collection", "1-2 weeks", "Claimant"],
          ["Form IEPF-5 + dispatch to company", "1 week", "Claimant"],
          ["Company verification + report to IEPF Authority", "30 days", "Company"],
          ["IEPF Authority processing", "30-60 days", "MCA / IEPF Authority"],
          ["Bank credit + demat credit", "5-10 days", "Authority"],
        ],
      },
      note:
        "Claims for deceased holders take significantly longer because the company verification step itself can stretch to 90 days while succession documents are scrutinised.",
    },
    {
      id: "07",
      heading: "COMMON REASONS CLAIMS GET REJECTED",
      body:
        "Most rejections stem from mismatched information or incomplete paperwork.",
      bullets: [
        "Name on PAN doesn't match name on share certificates or demat account (very common after marriage or name corrections).",
        "Folio number provided doesn't match company records, often because of a folio consolidation or share split.",
        "Indemnity bond on inadequate stamp paper or with missing notarisation.",
        "Advance receipt not signed or wrong amount stated.",
        "Demat account details mismatched, blocking credit of shares.",
        "For deceased holders, succession documents not in the prescribed format.",
      ],
    },
    {
      id: "08",
      heading: "WHEN TO USE A PROFESSIONAL",
      body:
        "IEPF claims are bureaucratic but not legally complex for living holders with clean documents. Professional help typically pays off in three scenarios.",
      bullets: [
        "Deceased holder claims with multiple heirs and complex succession documents.",
        "Shares last held more than 20 years ago, with multiple corporate actions (splits, bonuses, mergers) since.",
        "Physical share certificates lost, requiring duplicate issuance and indemnity procedures before IEPF claim can begin.",
      ],
    },
    {
      id: "09",
      heading: "HOW TO CHECK IF YOU HAVE UNCLAIMED IEPF SHARES",
      body:
        "The IEPF Authority maintains a public search facility on its portal. You can search by name, folio number, or PAN to identify unclaimed amounts and shares transferred to IEPF in your name. We recommend running the search at least once a year, especially if you've held shares with companies for over a decade or inherited shares from a parent.",
    },
  ],
  faqs: [
    {
      q: "How far back can I claim?",
      a: "There's no time limit on filing an IEPF claim. Once amounts are transferred to IEPF, they stay claimable indefinitely by the rightful owner or successor. Even claims for shares transferred 10 to 15 years ago are accepted, provided documentation is in order.",
    },
    {
      q: "Will I get back the shares or just the dividend amount?",
      a: "Both, where applicable. If the shares themselves were transferred to IEPF (because seven consecutive years of unclaimed dividends triggered the share transfer), the shares are returned to your demat account along with all unclaimed dividends. If only the dividends were transferred, only the cash comes back.",
    },
    {
      q: "What about bonus shares declared while the original shares were in IEPF?",
      a: "Bonus shares, splits, mergers and other corporate actions that occurred while shares were in IEPF custody also belong to the original beneficiary. The IEPF Authority tracks these adjustments and credits them along with the original shares when the claim is settled.",
    },
    {
      q: "Can a foreign citizen or NRI file an IEPF claim?",
      a: "Yes. NRIs and foreign citizens who held Indian shares can file IEPF claims. Some additional documentation around residency, tax status and bank account (typically NRO/NRE) is needed. Repatriation of claim amounts follows separate FEMA rules.",
    },
    {
      q: "Is there a fee for filing IEPF-5?",
      a: "No filing fee on the form itself. Stamp paper for indemnity bond and notarisation costs are usually under Rs 1,000. Professional fees if you engage a CS or lawyer are separate.",
    },
    {
      q: "What if the company has been delisted, merged or struck off?",
      a: "Claims can still be filed even where the original company has gone through structural changes. The successor entity (in case of merger) or the IEPF Authority itself (in case of strike-off) processes the claim. We've handled claims for companies that no longer exist by working through the successor records.",
    },
  ],
  sources: [
    {
      name: "IEPF Authority",
      url: "https://www.iepf.gov.in/",
      description: "Official IEPF Authority portal, claim search, and Form IEPF-5.",
    },
    {
      name: "Section 124 and 125, Companies Act 2013",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Statutory provisions for transfer of unclaimed dividends and shares.",
    },
    {
      name: "IEPF Authority (Accounting, Audit, Transfer and Refund) Rules, 2016",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Procedural rules for transfer to and refund from IEPF.",
    },
  ],
};
