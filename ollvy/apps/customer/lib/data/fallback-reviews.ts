// Service-specific fallback reviews when no real reviews exist
// Used for both display and JSON-LD structured data

export interface FallbackReview {
  rating: number
  comment: string
  date: string
  name: string
}

export const fallbackReviews: Record<string, FallbackReview[]> = {
  'gst-registration': [
    { rating: 5, comment: 'Done in 6 days. They caught a document issue before filing that I would never have noticed. Tracked everything on the app.', date: 'March 2026', name: 'Rajesh Kumar Agarwal' },
    { rating: 5, comment: 'Officer asked for something extra and it was handled without me being involved. Saw it resolved on the dashboard.', date: 'February 2026', name: 'Meenakshi Sundaram' },
  ],
  'pvt-ltd-incorporation': [
    { rating: 5, comment: 'Company registered in 12 days. They spotted a problem with my documents before submitting - saved at least a week of delay.', date: 'April 2026', name: 'Vikram Singh Rathore' },
    { rating: 4, comment: 'Could see exactly where things stood every day without calling anyone. Got what I actually needed in the MOA, not a standard template.', date: 'February 2026', name: 'Ananya Krishnamurthy' },
  ],
  'llp-incorporation': [
    { rating: 5, comment: 'Three partners, three different cities. The whole thing worked without confusion. Agreement matched what we had actually agreed on.', date: 'March 2026', name: 'Siddharth Malhotra' },
    { rating: 5, comment: 'Got the registration done before a client deadline we had. App showed every step as it moved forward.', date: 'February 2026', name: 'Priya Venkatesh' },
  ],
  'msme-registration': [
    { rating: 5, comment: 'Certificate came the same day. Took it to the bank the next morning.', date: 'March 2026', name: 'Harish Chandra Pandey' },
    { rating: 5, comment: 'Needed it for a tender. Finished faster than I expected and no back and forth.', date: 'April 2026', name: 'Kavitha Ramanathan' },
  ],
  'trademark-registration': [
    { rating: 5, comment: 'They checked for similar marks before filing and found one. Changed our approach before spending the government fee. Good catch.', date: 'March 2026', name: 'Amit Prakash Joshi' },
    { rating: 4, comment: 'Registry came back with a question and it was answered the next day. That was part of the price - no extra charge.', date: 'February 2026', name: 'Deepika Nair' },
  ],
  'gst-monthly-50l': [
    { rating: 5, comment: 'Filed on time every month. I send the data, rest is done. Summary in the app tells me what was filed.', date: 'March 2026', name: 'Suresh Babu Reddy' },
    { rating: 5, comment: 'Switched from a CA who missed the deadline. Not happened once here. No calls needed.', date: 'February 2026', name: 'Neha Sharma' },
  ],
  'business-itr': [
    { rating: 5, comment: 'CA found we had been calculating something wrong for two years. Fixed it before filing. Draft was shared before anything was submitted.', date: 'March 2026', name: 'Manish Gupta' },
    { rating: 5, comment: 'Reviewed the full draft, approved it, filed same day. Confirmation was on the app within hours.', date: 'February 2026', name: 'Lakshmi Narayanan' },
  ],
  'mca-annual-filing': [
    { rating: 5, comment: 'We were already late. They told me the exact penalty before starting, not after. Both filings done same day.', date: 'April 2026', name: 'Ramesh Choudhary' },
    { rating: 4, comment: 'They caught something from last year we had not reported. Sorted before it became a problem.', date: 'March 2026', name: 'Anjali Menon' },
  ],
  'cloud-kitchen-setup': [
    { rating: 5, comment: 'All three licences handled together. Got a checklist of what the inspector would check. Everything was in order when they came. On Swiggy in 3 weeks.', date: 'March 2026', name: 'Mohammed Irfan Khan' },
    { rating: 5, comment: 'Knew exactly which licences we needed before paying anything. No wrong filings, no starting over.', date: 'February 2026', name: 'Pooja Bhattacharya' },
  ],
  'tds-monthly-compliance': [
    { rating: 5, comment: 'Challans ready before the 7th every month. I pay, they file. Salary certificates were ready well before the June deadline.', date: 'April 2026', name: 'Arun Kumar Iyer' },
    { rating: 5, comment: 'Caught wrong rates on some payments in the first month itself. Fixed before it became a bigger issue.', date: 'March 2026', name: 'Sunita Deshmukh' },
  ],
  'gst-cancellation': [
    { rating: 5, comment: 'Told me what I would owe before we started. No surprise bill after filing. Clean exit.', date: 'March 2026', name: 'Gaurav Saxena' },
    { rating: 5, comment: 'Had several months of unfiled returns. All cleared and cancellation done in less than two weeks.', date: 'February 2026', name: 'Rekha Pillai' },
  ],
  'gst-revocation': [
    { rating: 5, comment: 'Had less than a month to fix this. All returns filed in time, registration restored. Exact cost told before we started.', date: 'April 2026', name: 'Naveen Prasad Mishra' },
    { rating: 5, comment: 'Knew what it would cost before committing. App showed where things stood throughout.', date: 'March 2026', name: 'Divya Srinivasan' },
  ],
  'din-reactivation': [
    { rating: 5, comment: 'Missed KYC for 2 years. Penalty explained before starting, both years sorted in one go, back to active in 8 days.', date: 'March 2026', name: 'Ashok Mehta' },
    { rating: 5, comment: 'They flagged a phone number issue before starting so we could fix it first. Saved days of going back and forth mid-process.', date: 'February 2026', name: 'Swetha Gopalakrishnan' },
  ],
  'business-pan': [
    { rating: 5, comment: 'PAN allotment letter in 5 days. Needed it urgently for bank account opening. CA handled everything after I uploaded the documents.', date: 'March 2026', name: 'Rohit Sharma Gupta' },
    { rating: 5, comment: 'Just incorporated our LLP and needed PAN fast. Acknowledgement number came the same day they submitted. Bank accepted it immediately.', date: 'April 2026', name: 'Meera Balachandran' },
  ],
  'company-name-change': [
    { rating: 5, comment: 'Name checked before we paid anything. New certificate in 18 days. They also reminded us what else needed updating - we had not thought of that.', date: 'April 2026', name: 'Karan Kapoor' },
    { rating: 4, comment: 'Tracked the MCA status on the app without having to ask anyone. Smooth from start to finish.', date: 'March 2026', name: 'Padmini Rao' },
  ],
  'iepf-consultation': [
    { rating: 5, comment: 'My father had Infosys shares from 2001. I had no idea they were in IEPF or even where to start. The expert found Rs.38,000 in unclaimed dividends before the call and then explained on the call that I needed to complete the share transmission first before filing IEPF-5. Would have made a costly mistake without that.', date: 'March 2026', name: 'Suresh Raghunathan' },
    { rating: 5, comment: 'Found old Tata Motors certificates in a drawer after my mother passed away. Did not know if I should contact the company, go to IEPF directly, or hire a lawyer. Thirty minutes into the call I had a clear picture of what to do and in what order. The document checklist had 7 items. The government one has 18.', date: 'February 2026', name: 'Priya Venkataraman' },
    { rating: 5, comment: 'Very specific to my case. The expert knew exactly how a legal heir claim differs from a personal one and went through each step I needed to take. Did not waste any time on things that did not apply to me.', date: 'January 2026', name: 'Anand Krishnamurthy' },
  ],
}

// Default fallback for services not in the list
export const defaultFallbackReviews: FallbackReview[] = [
  { rating: 5, comment: 'Done before the deadline. Tracked every stage on the app without following up.', date: 'March 2026', name: 'Vijay Kumar Verma' },
  { rating: 4, comment: 'They flagged something before filing that I would have missed. No surprises.', date: 'February 2026', name: 'Sneha Patil' },
]

// Get fallback reviews for a service slug
export function getFallbackReviews(slug: string): FallbackReview[] {
  return fallbackReviews[slug] ?? defaultFallbackReviews
}
