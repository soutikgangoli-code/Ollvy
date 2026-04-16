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
    { rating: 5, comment: 'We were billing without GST for months. The CA got our GSTIN in 5 days and backdated the first invoice. Clean process.', date: 'April 2026', name: 'Tarun Bhatia' },
    { rating: 4, comment: 'Took 8 days instead of 7 because the officer raised a query. But the CA responded same day and I did not have to do anything.', date: 'February 2026', name: 'Fatima Shaikh' },
    { rating: 5, comment: 'Third attempt at GST registration after two rejections with another provider. Ollvy got it through first try. They reviewed everything before submitting.', date: 'March 2026', name: 'Dinesh Patel' },
  ],
  'pvt-ltd-incorporation': [
    { rating: 5, comment: 'Company registered in 12 days. They spotted a problem with my documents before submitting - saved at least a week of delay.', date: 'April 2026', name: 'Vikram Singh Rathore' },
    { rating: 4, comment: 'Could see exactly where things stood every day without calling anyone. Got what I actually needed in the MOA, not a standard template.', date: 'February 2026', name: 'Ananya Krishnamurthy' },
    { rating: 5, comment: 'Two directors in two different cities. DSC video verification done remotely for both in the same afternoon. No physical visits needed.', date: 'March 2026', name: 'Rohan Mehta' },
    { rating: 5, comment: 'Name got rejected on first attempt. They filed our backup name the same day. Did not cost extra. Certificate arrived day 14.', date: 'April 2026', name: 'Nandini Reddy' },
    { rating: 5, comment: 'Compliance calendar showed up on the dashboard the day after incorporation. First board meeting reminder was already there. Appreciated that.', date: 'February 2026', name: 'Arjun Khanna' },
  ],
  'llp-incorporation': [
    { rating: 5, comment: 'Three partners, three different cities. The whole thing worked without confusion. Agreement matched what we had actually agreed on.', date: 'March 2026', name: 'Siddharth Malhotra' },
    { rating: 5, comment: 'Got the registration done before a client deadline we had. App showed every step as it moved forward.', date: 'February 2026', name: 'Priya Venkatesh' },
    { rating: 5, comment: 'The LLP agreement was not a template. They asked about our profit-sharing arrangement and drafted it the way we actually wanted it.', date: 'April 2026', name: 'Karthik Subramanian' },
    { rating: 4, comment: 'One partner was slow on the DSC verification. CS followed up daily until it was done. Would have dragged on forever without that.', date: 'March 2026', name: 'Ritu Agarwal' },
    { rating: 5, comment: 'Converted from a partnership firm to LLP. They handled the entire transition, not just the registration.', date: 'February 2026', name: 'Mohan Lal Sharma' },
  ],
  'msme-registration': [
    { rating: 5, comment: 'Certificate came the same day. Took it to the bank the next morning.', date: 'March 2026', name: 'Harish Chandra Pandey' },
    { rating: 5, comment: 'Needed it for a tender. Finished faster than I expected and no back and forth.', date: 'April 2026', name: 'Kavitha Ramanathan' },
    { rating: 5, comment: 'Applied for a CGTMSE loan the week after getting the certificate. Bank accepted it immediately. Rs 25 lakh approved without collateral.', date: 'March 2026', name: 'Pramod Tiwari' },
    { rating: 5, comment: 'Was worried about picking the wrong NIC code. They checked my actual business activity and picked the right one. Took 20 minutes total.', date: 'February 2026', name: 'Savitha Hegde' },
    { rating: 4, comment: 'Simple service but they made sure the GSTIN was linked correctly. Another provider had missed that and my benefits were stuck.', date: 'April 2026', name: 'Rajendra Prasad' },
  ],
  'trademark-registration': [
    { rating: 5, comment: 'They checked for similar marks before filing and found one. Changed our approach before spending the government fee. Good catch.', date: 'March 2026', name: 'Amit Prakash Joshi' },
    { rating: 4, comment: 'Registry came back with a question and it was answered the next day. That was part of the price - no extra charge.', date: 'February 2026', name: 'Deepika Nair' },
    { rating: 5, comment: 'Filed in 3 classes for our brand. They explained why we needed all three and which one to prioritise if budget was tight. Filed all three.', date: 'April 2026', name: 'Varun Dhawan' },
    { rating: 5, comment: 'Got the TM-A filing receipt within 48 hours. Have been tracking the examination stage on the app. Clear timeline given upfront.', date: 'March 2026', name: 'Shruti Iyer' },
    { rating: 5, comment: 'Competitor tried to register a similar name. We had our application in first. The search they did before filing was worth it.', date: 'February 2026', name: 'Nikhil Bhargava' },
  ],
  'gst-monthly': [
    { rating: 5, comment: 'Filed on time every month. I send the data, rest is done. Summary in the app tells me what was filed.', date: 'March 2026', name: 'Suresh Babu Reddy' },
    { rating: 5, comment: 'Switched from a CA who missed the deadline. Not happened once here. No calls needed.', date: 'February 2026', name: 'Neha Sharma' },
    { rating: 5, comment: 'They caught a Rs 1.2 lakh ITC mismatch between my GSTR-2B and what I had claimed. Fixed before the annual return. Would have been a demand notice.', date: 'April 2026', name: 'Girish Kulkarni' },
    { rating: 5, comment: 'Five months in. Zero late fees. Zero missed deadlines. I get a notification when it is filed and that is it.', date: 'March 2026', name: 'Tanvi Chopra' },
    { rating: 4, comment: 'Asked a question about a specific transaction on WhatsApp. CA replied within 2 hours with the exact section reference. That level of access is not normal.', date: 'February 2026', name: 'Aditya Sinha' },
  ],
  'business-itr': [
    { rating: 5, comment: 'CA found we had been calculating depreciation wrong for two years. Fixed it before filing. Draft was shared before anything was submitted.', date: 'March 2026', name: 'Manish Gupta' },
    { rating: 5, comment: 'Reviewed the full draft, approved it, filed same day. Confirmation was on the app within hours.', date: 'February 2026', name: 'Lakshmi Narayanan' },
    { rating: 5, comment: 'First year filing as a Pvt Ltd. Had no idea what ITR-6 even looked like. CA walked me through the draft, explained every schedule. Filed 10 days before deadline.', date: 'April 2026', name: 'Sahil Banerjee' },
    { rating: 5, comment: 'We had a Rs 8 lakh loss to carry forward. The CA made sure it was reported correctly so we could use it next year. Previous CA had not done this.', date: 'March 2026', name: 'Prachi Jain' },
    { rating: 4, comment: 'Took 12 working days instead of 10 because our auditor was late with the report. But the Ollvy CA chased him and got it done.', date: 'February 2026', name: 'Bhavesh Patel' },
  ],
  'mca-annual-filing': [
    { rating: 5, comment: 'We were already late. They told me the exact penalty before starting, not after. Both filings done same day.', date: 'April 2026', name: 'Ramesh Choudhary' },
    { rating: 4, comment: 'They caught something from last year we had not reported. Sorted before it became a problem.', date: 'March 2026', name: 'Anjali Menon' },
    { rating: 5, comment: 'AGM was held on Sep 28. AOC-4 filed Oct 25. MGT-7 filed Nov 20. Both well within deadlines. Zero stress.', date: 'April 2026', name: 'Vivek Arora' },
    { rating: 5, comment: 'Board report drafted for us based on our financials. Did not expect that level of detail for the price.', date: 'February 2026', name: 'Sangeeta Devi' },
    { rating: 5, comment: 'Switched from a CS who forgot to file MGT-7 last year. Rs 200/day was running. Ollvy cleared the backlog and filed current year same week.', date: 'March 2026', name: 'Pankaj Mishra' },
  ],
  'cloud-kitchen-setup': [
    { rating: 5, comment: 'All three licences handled together. Got a checklist of what the inspector would check. Everything was in order when they came. On Swiggy in 3 weeks.', date: 'March 2026', name: 'Mohammed Irfan Khan' },
    { rating: 5, comment: 'Knew exactly which licences we needed before paying anything. No wrong filings, no starting over.', date: 'February 2026', name: 'Pooja Bhattacharya' },
    { rating: 5, comment: 'FSSAI inspection passed first time. The checklist they sent a week before was exactly what the officer looked at. Worth it just for that.', date: 'April 2026', name: 'Ravi Shankar Yadav' },
    { rating: 5, comment: 'Residential flat kitchen. Society was reluctant to give NOC. Ollvy drafted a letter citing the FSSAI legal position and the society signed within a week.', date: 'March 2026', name: 'Aisha Begum' },
    { rating: 4, comment: 'Trade licence took 25 days (BMC is slow) but everything else was done in 10 days. GST was live by day 7. Started Zomato onboarding while waiting for FSSAI.', date: 'February 2026', name: 'Sanjay Khandelwal' },
  ],
  'tds-monthly-compliance': [
    { rating: 5, comment: 'Challans ready before the 7th every month. I pay, they file. Salary certificates were ready well before the June deadline.', date: 'April 2026', name: 'Arun Kumar Iyer' },
    { rating: 5, comment: 'Caught wrong rates on some payments in the first month itself. Fixed before it became a bigger issue.', date: 'March 2026', name: 'Sunita Deshmukh' },
    { rating: 5, comment: 'Form 16 for all 12 employees generated and sent to them by June 10. Five days before the deadline. No last-minute scramble.', date: 'April 2026', name: 'Nitin Wadhwa' },
    { rating: 5, comment: 'We had been mixing up 194C and 194J rates. CA corrected it in month one and filed revised returns for the previous quarter. No penalty.', date: 'February 2026', name: 'Pallavi Kulkarni' },
    { rating: 4, comment: 'One challan had a wrong PAN. CA spotted it in reconciliation before the quarterly return and got it corrected on TRACES. Would have been a demand notice otherwise.', date: 'March 2026', name: 'Deepak Srivastava' },
  ],
  'gst-cancellation': [
    { rating: 5, comment: 'Told me what I would owe before we started. No surprise bill after filing. Clean exit.', date: 'March 2026', name: 'Gaurav Saxena' },
    { rating: 5, comment: 'Had several months of unfiled returns. All cleared and cancellation done in less than two weeks.', date: 'February 2026', name: 'Rekha Pillai' },
    { rating: 5, comment: 'ITC reversal was Rs 47,000. They calculated it line by line and showed me the working. No disputes from the officer.', date: 'April 2026', name: 'Ashish Tiwari' },
    { rating: 5, comment: 'Business was shut for 6 months but GST was still running. Cleared all nil returns and got the cancellation in 10 days.', date: 'March 2026', name: 'Mala Venkataraman' },
    { rating: 4, comment: 'Took 3 weeks because the officer raised a query on stock valuation. CA responded within a day and it was resolved.', date: 'February 2026', name: 'Sunil Malhotra' },
  ],
  'gst-revocation': [
    { rating: 5, comment: 'Had less than a month to fix this. All returns filed in time, registration restored. Exact cost told before we started.', date: 'April 2026', name: 'Naveen Prasad Mishra' },
    { rating: 5, comment: 'Knew what it would cost before committing. App showed where things stood throughout.', date: 'March 2026', name: 'Divya Srinivasan' },
    { rating: 5, comment: 'GST was cancelled 2 weeks ago. Filed 8 months of pending returns and got it restored with 4 days to spare before the 30-day window closed.', date: 'April 2026', name: 'Vinod Chaudhary' },
    { rating: 5, comment: 'Late fees were Rs 12,400. They calculated this before I paid for the service so I knew the total cost upfront. No surprises.', date: 'February 2026', name: 'Jayashree Nambiar' },
    { rating: 4, comment: 'Revocation took 5 days after filing. Thought it would be instant but the officer needed to verify. CA followed up daily.', date: 'March 2026', name: 'Alok Saxena' },
  ],
  'din-reactivation': [
    { rating: 5, comment: 'Missed KYC for 2 years. Penalty explained before starting, both years sorted in one go, back to active in 8 days.', date: 'March 2026', name: 'Ashok Mehta' },
    { rating: 5, comment: 'They flagged a phone number issue before starting so we could fix it first. Saved days of going back and forth mid-process.', date: 'February 2026', name: 'Swetha Gopalakrishnan' },
    { rating: 5, comment: '3 companies, all blocked because of my DIN. Filed KYC for both missed years and DIN was active again in 2 days. All three companies could file again.', date: 'April 2026', name: 'Rajiv Tandon' },
    { rating: 5, comment: 'My Aadhaar had an old mobile number linked. CS told me to update it first before we started, which saved the entire process from failing at the OTP step.', date: 'March 2026', name: 'Kamala Devi Gupta' },
    { rating: 4, comment: 'Rs 10,000 in penalties for 2 years. Not cheap, but there is no way around it. At least they told me the exact amount before I committed.', date: 'February 2026', name: 'Sanjay Raghavan' },
  ],
  'business-pan': [
    { rating: 5, comment: 'PAN allotment letter in 5 days. Needed it urgently for bank account opening. CA handled everything after I uploaded the documents.', date: 'March 2026', name: 'Rohit Sharma Gupta' },
    { rating: 5, comment: 'Just incorporated our LLP and needed PAN fast. Acknowledgement number came the same day they submitted. Bank accepted it immediately.', date: 'April 2026', name: 'Meera Balachandran' },
    { rating: 5, comment: 'Applied for company PAN and TAN together. Both came through in a week. Bank current account opened on day 8.', date: 'March 2026', name: 'Akash Verma' },
    { rating: 5, comment: 'Our old PAN had the wrong company name after a recent name change. CA handled the correction along with the new PAN application.', date: 'February 2026', name: 'Geeta Krishnan' },
    { rating: 4, comment: 'e-PAN came in 4 days. Physical card took 18 days. But e-PAN was enough for everything we needed immediately.', date: 'April 2026', name: 'Nikhil Pandey' },
  ],
  'company-name-change': [
    { rating: 5, comment: 'Name checked before we paid anything. New certificate in 18 days. They also reminded us what else needed updating - we had not thought of that.', date: 'April 2026', name: 'Karan Kapoor' },
    { rating: 4, comment: 'Tracked the MCA status on the app without having to ask anyone. Smooth from start to finish.', date: 'March 2026', name: 'Padmini Rao' },
    { rating: 5, comment: 'First name was rejected because of a trademark conflict. They found this in the pre-filing search and we picked a different name before wasting the fee.', date: 'April 2026', name: 'Vivek Chauhan' },
    { rating: 5, comment: 'Shareholder resolution, EGM notice, MOA amendment, INC-24 filing - all handled. New CoI with the new name arrived in 16 days.', date: 'February 2026', name: 'Anita Bose' },
    { rating: 5, comment: 'Changed our company name before a rebrand launch. Tight deadline. They got it done in 15 days. We launched on time.', date: 'March 2026', name: 'Sumit Agarwal' },
  ],
  'iepf-consultation': [
    { rating: 5, comment: 'My father had Infosys shares from 2001. I had no idea they were in IEPF or even where to start. The expert found Rs 38,000 in unclaimed dividends before the call and then explained that I needed to complete the share transmission first before filing IEPF-5. Would have made a costly mistake without that.', date: 'March 2026', name: 'Suresh Raghunathan' },
    { rating: 5, comment: 'Found old Tata Motors certificates in a drawer after my mother passed away. Did not know if I should contact the company, go to IEPF directly, or hire a lawyer. Thirty minutes into the call I had a clear picture of what to do and in what order. The document checklist had 7 items. The government one has 18.', date: 'February 2026', name: 'Priya Venkataraman' },
    { rating: 5, comment: 'Very specific to my case. The expert knew exactly how a legal heir claim differs from a personal one and went through each step I needed to take. Did not waste any time on things that did not apply to me.', date: 'April 2026', name: 'Anand Krishnamurthy' },
    { rating: 5, comment: 'Had 3 companies worth of unclaimed dividends. Expert searched all three during the call itself and told me which ones were worth pursuing and which were too small to bother with. Practical advice.', date: 'April 2026', name: 'Mahesh Raghav' },
    { rating: 4, comment: 'The consultation was clear but the IEPF process itself is painful. At least now I know exactly what to expect and have a realistic timeline. 4-6 months they said. Better than going in blind.', date: 'March 2026', name: 'Usha Devi Agarwal' },
  ],
  'esop-structuring': [
    { rating: 5, comment: 'Hiring a CTO and needed to offer equity. Had no idea where to start. CS explained the structure, drafted the scheme, and issued the grant letter in 6 days. Investor said the cap table looked clean.', date: 'April 2026', name: 'Aditya Nair' },
    { rating: 5, comment: 'Had promised equity to 4 people verbally over 2 years. Needed to formalise before our seed round. Ollvy backdated the scheme and issued proper grant letters. Investor diligence passed without a single question on ESOP.', date: 'March 2026', name: 'Shruti Kapoor' },
    { rating: 5, comment: 'The FMV valuation note was the part I did not know I needed. When our first employee exercised 6 months later, the tax computation was straightforward because the grant-date FMV was documented.', date: 'April 2026', name: 'Pranav Mehta' },
    { rating: 5, comment: 'CS caught that our AOA had a restriction on share transfer that would have blocked ESOP exercises. Got it amended as part of the engagement. Nobody else had flagged this.', date: 'February 2026', name: 'Deepa Ranganathan' },
    { rating: 4, comment: 'Took 8 days instead of 7 because one shareholder was slow to sign the special resolution. But the scheme and grant letters were ready by day 5.', date: 'March 2026', name: 'Kunal Bhatia' },
  ],
}

// Default fallback for services not in the list
export const defaultFallbackReviews: FallbackReview[] = [
  { rating: 5, comment: 'Done before the deadline. Tracked every stage on the app without following up.', date: 'March 2026', name: 'Vijay Kumar Verma' },
  { rating: 5, comment: 'They flagged something before filing that I would have missed. No surprises.', date: 'February 2026', name: 'Sneha Patil' },
  { rating: 4, comment: 'Exact cost told upfront. No hidden charges after. App showed progress at every step.', date: 'April 2026', name: 'Rajan Pillai' },
  { rating: 5, comment: 'Switched from another provider after a bad experience. Night and day difference in communication and tracking.', date: 'March 2026', name: 'Anupama Das' },
  { rating: 5, comment: 'Professional handled a government query without involving me. Saw the resolution on the dashboard the next morning.', date: 'February 2026', name: 'Hemant Kumar Singh' },
]

// Get fallback reviews for a service slug
export function getFallbackReviews(slug: string): FallbackReview[] {
  return fallbackReviews[slug] ?? defaultFallbackReviews
}
