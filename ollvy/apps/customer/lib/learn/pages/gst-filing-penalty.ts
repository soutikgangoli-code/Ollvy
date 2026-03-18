// lib/learn/pages/gst-filing-penalty.ts
import { LearnPageConfig } from '../pages';

export const gstFilingPenalty: LearnPageConfig = {
  slug: 'gst-filing-penalty',
  title: 'GST Filing Penalties in India - Exact Amounts, Not Estimates',
  seoTitle: 'GST Late Filing Penalty India (2025) - GSTR-1, GSTR-3B, GSTR-9 Exact Amounts',
  seoDescription: 'GST late filing penalties: ₹100/day late fee plus 18% annual interest from day 21. Calculate your exact penalty for GSTR-1, GSTR-3B, and GSTR-9. Includes penalty calculator.',
  canonicalUrl: 'https://ollvy.com/learn/gst-filing-penalty',
  lastReviewed: 'March 2025',
  category: 'GST',
  ctaServiceSlug: 'gst-monthly-filing',
  relatedServiceSlugs: ['gst-registration', 'gst-monthly-filing'],
  relatedLearnSlugs: ['how-to-register-gst-india', 'gst-due-dates'],

  tool: {
    type: 'penalty',
    title: 'Calculate your exact GST penalty',
    penaltyType: 'gst',
  },

  sections: [
    {
      heading: 'GSTR-3B late filing - specific penalty amounts',
      body: `GSTR-3B is the monthly summary return. Due date: 20th of every month.

**Late fee** (Section 47, CGST Act):
- ₹50/day: ₹25 CGST + ₹25 SGST, if tax is payable
- ₹20/day: ₹10 CGST + ₹10 SGST, for nil returns (no tax due)
- Maximum: ₹5,000 per return (₹2,500 CGST + ₹2,500 SGST) for returns with tax liability
- Maximum: ₹500 per return (₹250 CGST + ₹250 SGST) for nil returns

**Interest on outstanding tax** (Section 50, CGST Act):
- 18% per annum on unpaid tax
- Starts from the day after the due date - not from when you discover the shortfall
- Calculated daily: (Tax due × 18%) ÷ 365 × days late

*Example*: GSTR-3B was due April 20. You file on May 10 with ₹1 lakh tax outstanding.
- Late fee: 20 days × ₹50/day = ₹1,000
- Interest: ₹1,00,000 × 18% ÷ 365 × 20 = ₹986
- Total additional cost: ₹1,986 on top of the ₹1 lakh tax

The interest accrues silently. Most founders discover the liability when a CA audits the books.`,
      note: 'Source: Section 47 (late fee) and Section 50 (interest) of CGST Act 2017.',
    },
    {
      heading: 'GSTR-1 late filing penalties',
      body: `GSTR-1 is the outward supply return. Due date: 11th of every month (or 13th for quarterly filers).

**Late fee**: ₹50/day (₹25 CGST + ₹25 SGST) for returns with outward supplies
**For nil returns**: ₹20/day
**Maximum**: ₹5,000 per return

**Cascading consequence - not just your problem**:
Your GSTR-1 feeds your buyer's ITC claim. If you file GSTR-1 late, your buyer's input tax credit (ITC) is blocked until you file. They may get a notice. They may call you.

This is why many B2B buyers ask their suppliers: "Are you GST compliant? Do you file on time?" Late GSTR-1 filing damages business relationships beyond the fine itself.`,
    },
    {
      heading: 'GSTR-9 annual return penalties',
      body: `GSTR-9 is the annual summary return. Due: December 31 for the previous financial year. Mandatory for businesses with annual turnover above ₹2 crore; optional below that.

**Late fee**: ₹200/day (₹100 CGST + ₹100 SGST)
**Maximum**: 0.25% of annual turnover in the state

*Example*: Annual turnover ₹80 lakh. You file GSTR-9 60 days late.
- Daily penalty: ₹200
- 60 days: ₹12,000
- Maximum cap: 0.25% × ₹80,00,000 = ₹20,000
- Actual penalty: ₹12,000 (below the cap)

If you file 100 days late: ₹20,000 penalty (capped).`,
      note: 'Source: Section 47, CGST Act 2017. Turnover-based cap as per CGST Notification.',
    },
    {
      heading: 'What to do if you\'ve already missed a deadline',
      body: `**Step 1**: File immediately. Late fee stops accruing the day you file. Every additional day adds to the penalty.

**Step 2**: Pay the late fee along with the return. The portal calculates it automatically when you file. You'll see the exact amount before submission.

**Step 3**: Check for interest liability. If there was outstanding tax when the return was due, interest has been accruing. A CA can calculate the exact amount - it shows up on your GSTR-3B as a liability.

**Step 4**: Check for amnesty. DPIIT and GSTN periodically announce GST amnesty schemes that waive or reduce late fees for businesses that file within a specified window. The most recent was in 2023. Watch for notifications - Ollvy's compliance calendar flags these when announced.

**Step 5**: Evaluate your ongoing risk. A single late filing indicates a process problem. Two or three suggests you need a retainer arrangement where a CA handles filing - removing the human error entirely.`,
    },
  ],
};
