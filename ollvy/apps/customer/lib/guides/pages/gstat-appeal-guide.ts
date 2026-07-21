// =============================================================================
// GUIDE PAGE: gstat-appeal-guide
// File path: lib/guides/pages/gstat-appeal-guide.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const gstatAppealGuide: LearnPageConfig = {
  slug: "gstat-appeal-guide",
  title: "Appealing to the GST Appellate Tribunal (GSTAT): Deadlines, Pre-Deposit, Process",
  seoTitle: "GSTAT Appeal 2026: 3-Month Deadline, Pre-Deposit, APL-05 | Ollvy",
  seoDescription:
    "Lost your first GST appeal? You have 3 months from the order to file APL-05 before GSTAT with a 10% pre-deposit. Miss it and recovery can hit your bank account.",
  canonicalUrl: "https://www.ollvy.com/guides/gstat-appeal-guide",
  lastReviewed: "July 2026",
  category: "GST Notice",
  severity: "moderate",
  deadline: "3 months from the appellate order",
  deadlineNote:
    "GSTAT can condone a further 3 months' delay for sufficient cause, but beyond that the demand becomes final and recoverable, including by bank attachment under Section 79.",
  relatedServiceSlugs: ["gst-monthly", "gst-revocation", "gst-cancellation"],
  relatedLearnSlugs: [
    "gst-drc-01-notice",
    "gst-asmt-10-notice",
    "gst-drc-01b-mismatch",
    "gst-invoice-management-system-ims",
  ],
  ctaServiceSlug: "gst-monthly",
  sections: [
    {
      id: "01",
      heading: "WHERE GSTAT FITS AND WHETHER YOU CAN APPEAL",
      body:
        "The GST Appellate Tribunal (GSTAT) is the second appeal level in GST: it hears appeals against orders of the first appellate authority (the Commissioner (Appeals) route you used via Form APL-01) under Section 112 of the CGST Act. If your APL-01 appeal was rejected or partly rejected, you have 3 months from the date the appellate order is communicated to file an appeal to GSTAT in Form APL-05, with a pre-deposit of 10% of the disputed tax (subject to a monetary cap).\n\nFor years this right was theoretical because the tribunal did not sit; demands stuck at the first-appeal stage with nowhere to go. That changed through 2025-26: benches are constituted, the e-filing portal is live, and after the 30 June 2026 limitation date for the backlog of pre-tribunal appeals, hearings are scaling up through 2026-27. If you received an unfavourable appellate order recently, the 3-month clock is real and running.",
    },
    {
      id: "02",
      heading: "THE DEADLINES, PRECISELY",
      body: "",
      bullets: [
        "Normal limitation: 3 months from the date of communication of the first appellate order (Section 112(1)).",
        "Condonation: GSTAT may allow a further 3 months if you show sufficient cause for the delay; beyond that, the appeal right lapses.",
        "Backlog cases: for appellate orders passed before the tribunal became operational, the special limitation window ran to 30 June 2026. Orders communicated after that follow the normal 3-month rule.",
        "Department's cross-appeals: the department gets 6 months, so a matter you thought settled can still be appealed against you within that window.",
        "Memorandum of cross-objections: 45 days from receiving notice of the other side's appeal.",
      ],
      note:
        "Count from communication (upload on the portal / service), not the order's internal date, and keep evidence of when you received it.",
    },
    {
      id: "03",
      heading: "THE PRE-DEPOSIT MATH",
      body:
        "Filing before GSTAT requires an additional pre-deposit of 10% of the disputed tax, over and above the 10% already deposited at the APL-01 stage, with the GSTAT-stage deposit subject to a monetary cap (Rs 20 crore each for CGST and SGST after the 2024 amendments). Interest, penalty and fee amounts in dispute do not require pre-deposit in the ordinary course.",
      bullets: [
        "Example: disputed tax of Rs 40 lakh. APL-01 stage: Rs 4 lakh deposited. GSTAT stage: a further Rs 4 lakh, taking the total parked to Rs 8 lakh.",
        "Payment is made through the electronic cash ledger against the demand; credit ledger usage for pre-deposit has been litigated, so plan cash.",
        "The payoff: on making the GSTAT pre-deposit, recovery proceedings for the balance are stayed under Section 112(9) while the appeal is pending.",
        "If you win, the pre-deposit is refundable with interest from the date of payment.",
      ],
    },
    {
      id: "04",
      heading: "WHAT MISSING THE WINDOW COSTS",
      body:
        "An unappealed appellate order becomes final, and the machinery that follows is fast and unilateral.",
      bullets: [
        "Section 78: the demand becomes payable within 3 months of the order (and the officer can shorten this in revenue-interest cases).",
        "Section 79: recovery follows without further notice: attachment of bank accounts, garnishee notices to your debtors (customers receive letters directing them to pay the department instead of you), and attachment and sale of assets.",
        "GSTIN-level consequences: unpaid finalised demands surface in registration-level actions and refund set-offs.",
        "A time-barred appeal cannot be revived by paying later; condonation beyond the additional 3 months is not available to GSTAT.",
      ],
      note:
        "Bank attachment is the consequence that businesses actually feel: it typically lands without warning and freezes operations overnight. The 10% pre-deposit is the price of preventing exactly that.",
    },
    {
      id: "05",
      heading: "FILING THE APPEAL: FORM APL-05 ON THE GSTAT PORTAL",
      body: "",
      bullets: [
        "File Form APL-05 electronically on the GSTAT e-filing portal, quoting the impugned appellate order and the original adjudication order.",
        "Pay the pre-deposit and the prescribed appeal fee (fee scales with the amount in dispute, subject to a cap).",
        "Attach the grounds of appeal: each finding of the appellate authority you contest, with the legal and factual basis; new grounds not raised below need explicit justification.",
        "Attach the evidence record: the SCN, your replies, the adjudication order (DRC-07 summary), the APL-01 appeal and order, payment challans, and relied-upon documents.",
        "A certified copy of the appealed order must follow within the prescribed period where the portal filing requires it.",
        "After scrutiny, the registry issues a defect memo or admits the appeal and it proceeds to listing before the bench (a two-member bench ordinarily; single-member for smaller, non-question-of-law matters as notified).",
      ],
    },
    {
      id: "06",
      heading: "WHAT MAKES A GSTAT APPEAL WORTH FILING",
      body:
        "GSTAT is the first level where an independent judicial member hears the matter, and historically (from the erstwhile CESTAT/VAT tribunal experience) taxpayer success rates improve markedly at the tribunal stage. Appeals worth pursuing typically involve:",
      bullets: [
        "Interpretation disputes: classification, rate entries, exemption notifications, place-of-supply, where the lower orders simply adopted the department's circular reading.",
        "Procedural violations: orders passed without hearing, beyond SCN grounds, or time-barred under Sections 73/74 limitation.",
        "Evidence disputes the first appeal did not engage with: transporter records, e-way bills and payment trails in fake-ITC allegations.",
        "Precedent-backed positions: High Court rulings in your favour that the appellate authority declined to follow.",
        "Pure penalty disputes, where pre-deposit is not the barrier and the downside is bounded.",
      ],
      note:
        "Cost-benefit still matters: for a Rs 2 lakh disputed tax, professional fees can approach the amount at stake. For six-figure and larger demands, the tribunal is usually the first genuinely winnable forum.",
    },
    {
      id: "07",
      heading: "TIMELINE AND WHAT HAPPENS AT THE HEARING",
      body:
        "GSTAT is directed to decide appeals within a year of filing where possible; with the backlog absorbed through 2026-27, real-world timelines will vary by bench. The sequence: admission and notice to the department, the department's reply, listing, oral hearing (counsel or authorised representative argues; CAs and advocates can appear), and a written order. GSTAT can confirm, modify or annul the order below, or remand it. Further appeal from GSTAT lies to the High Court on substantial questions of law (Section 117), within 180 days.\n\nWhile the appeal is pending, keep the underlying compliance clean: continue filing returns, and do not let the disputed period's conduct repeat, since ongoing periods with the same issue accumulate their own demands rather than riding your appeal.",
    },
    {
      id: "08",
      heading: "DECISION FRAMEWORK: PAY, APPEAL, OR SETTLE",
      body: "",
      table: {
        headers: ["Situation", "Sensible route", "Why"],
        rows: [
          ["Order is legally weak, tax at stake is large", "GSTAT appeal within 3 months", "First independent forum; recovery stayed on 10% deposit"],
          ["Order is correct, you simply owe it", "Pay within the Section 78 window", "Stops interest accumulation at 18% and recovery action"],
          ["Section 73 (non-fraud) case, want closure", "Pay tax + interest, penalty relief provisions", "Penalty exposure closes cheaply in non-fraud cases"],
          ["Missed the 3-month + condonation window", "Writ jurisdiction advice, then pay", "GSTAT cannot condone further; High Court writ is exceptional relief"],
        ],
      },
    },
  ],
  faqs: [
    {
      q: "My APL-01 appeal was rejected in June 2026. By when must I reach GSTAT?",
      a: "Three months from the date the appellate order was communicated to you, so an order communicated on 15 June 2026 needs the APL-05 filed by 15 September 2026. GSTAT can condone up to 3 further months for sufficient cause, but treat that as an emergency parachute, not planning room. Diarise from the communication date and preserve proof of when the order reached you.",
    },
    {
      q: "How much do I actually have to pay to file, on a Rs 25 lakh disputed tax demand?",
      a: "A further pre-deposit of Rs 2.5 lakh (10% of disputed tax) at the GSTAT stage, on top of the Rs 2.5 lakh already paid at APL-01, plus the appeal fee. Disputed interest and penalty do not need pre-deposit. On payment, recovery of the remaining Rs 20 lakh (plus interest and penalty) is stayed under Section 112(9) for the life of the appeal, and the deposit comes back with interest if you win.",
    },
    {
      q: "Can I appeal only against the penalty portion and pay the tax?",
      a: "Yes. You can restrict the appeal to the components you dispute; paying the tax while contesting penalty and interest is a common and coherent position, and it stops the 18% interest meter on the tax. Structure the DRC-03 payment and the grounds of appeal so it is explicit which components are conceded and which contested.",
    },
    {
      q: "The department may also appeal the parts I won at APL-01. Can they?",
      a: "Yes, the department can appeal to GSTAT against the portions decided in your favour, and it has 6 months to do so. If the department appeals, you will get notice and can file cross-objections within 45 days defending your win. A partial APL-01 victory is therefore not final until the department's window closes; do not treat refunds arising from it as untouchable until then.",
    },
    {
      q: "Is there any way to skip GSTAT and go straight to the High Court?",
      a: "Only in narrow situations: writ jurisdiction is entertained where there is a jurisdictional defect, a violation of natural justice, or a challenge to the vires of a provision, not merely because you disagree with the order. Now that GSTAT is functional, High Courts routinely dismiss writs on alternative-remedy grounds. The statutory route through APL-05 is the default; treat writs as exceptional and take specific advice before betting your limitation period on one.",
    },
    {
      q: "What happens to recovery between the appellate order and my GSTAT filing?",
      a: "There is a gap risk. The demand becomes payable under Section 78 (3 months from the order), and the stay only operates once you file the appeal and make the pre-deposit. If recovery action begins before you file, filing with pre-deposit stops it going further. Practical rule: if you have decided to appeal, file early in the window rather than at day 85, especially if your bank accounts cannot survive an attachment.",
    },
    {
      q: "Can my CA argue the case, or do I need an advocate?",
      a: "Authorised representatives before GSTAT include advocates, chartered accountants, cost accountants and company secretaries, so your CA can appear. For matters turning on pure legal interpretation or heading toward the High Court on a question of law, pairing the CA (facts, records) with GST counsel (argument) is the common structure for larger demands.",
    },
    {
      q: "My appellate order is from 2024, before GSTAT was functional. Have I lost the right?",
      a: "The special limitation window for exactly that backlog required those appeals to be filed by 30 June 2026. If you filed by then, your appeal is in the queue as hearings scale up. If you did not, the normal condonation power (3 months) does not stretch back that far, and the demand is at serious risk of being treated as final; take immediate advice on condonation applications and writ options rather than waiting for a recovery notice.",
    },
  ],
  sources: [
    {
      name: "CGST Act 2017, Sections 112, 78, 79 and 117",
      url: "https://www.cbic.gov.in/",
      description: "Appeal to the Appellate Tribunal, payment and recovery provisions, and further appeal to the High Court.",
    },
    {
      name: "Dhruva Advisors: 56th GST Council note",
      url: "https://www.dhruvaadvisors.com/",
      description: "Council decisions on GSTAT operationalisation and the backlog-appeal limitation timeline.",
    },
    {
      name: "TaxTMI: GSTAT operational status and procedure",
      url: "https://www.taxtmi.com/",
      description: "Coverage of GSTAT benches, e-filing portal and APL-05 procedure.",
    },
    {
      name: "GSTAT e-Filing Portal",
      url: "https://gstat.gov.in/",
      description: "Electronic filing of APL-05 appeals and cause-list tracking.",
    },
  ],
};
