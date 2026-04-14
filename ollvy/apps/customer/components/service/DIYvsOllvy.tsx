'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DIYRow {
  task: string
  own: string
  ollvy_head: string
  ollvy_badge: string
}

interface DIYData {
  off_stat: string
  on_stat: string
  on_date_label: string
  rows: DIYRow[]
}

interface DIYvsOllvyProps {
  slug: string
  guaranteedDate?: string | null
  isRetainer?: boolean
  totalFee?: number
}

export const DATA: Record<string, DIYData> = {
  'gst-registration': {
    off_stat: '14 hrs of your time. No deadline. No accountability.',
    on_stat: 'Save 14 hrs + \u20B98,000 in wasted effort.',
    on_date_label: 'Guaranteed by',
    rows: [
      { task: 'Gathering documents', own: ' 3-4 hrs. One mismatch and you\'re back to square one.', ollvy_head: 'AI picks your exact list.', ollvy_badge: '98% go through.' },
      { task: 'Filing the application', own: '4-6 hrs on a portal that gives no error messages.', ollvy_head: 'Ollvy CA checks every field.', ollvy_badge: 'Reference number same day.' },
      { task: 'Getting it done', own: '7 days or 22. No way to know.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'GST officer query', own: '1 in 5 get one. Wrong reply = restart from scratch.', ollvy_head: 'Ollvy CA replies in 24 hrs.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B92,000-5,000. More if anything goes wrong.', ollvy_head: '\u20B9999.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'pvt-ltd-incorporation': {
    off_stat: '2 full days. 3 professionals. Nobody owns the outcome.',
    on_stat: 'Save 2 days + \u20B922,000 in extra fees.',
    on_date_label: 'Guaranteed by',
    rows: [
      { task: 'Gathering documents', own: 'Physical signature visit. One wrong doc and you restart.', ollvy_head: 'AI picks your exact list.', ollvy_badge: '98% go through.' },
      { task: 'Filing for incorporation', own: '6-10 hrs. Wrong name costs \u20B91,000 and 5 days.', ollvy_head: 'Ollvy CA and CS handle everything.', ollvy_badge: 'Company number to your app.' },
      { task: 'Getting incorporated', own: '15-25 days. Deficiency notices appear with no warning.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'Government correction notices', own: '\u20B92,000-5,000 per round. Rounds are unlimited.', ollvy_head: 'Unlimited revisions.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B918,000-40,000. Three professionals. Three invoices.', ollvy_head: '\u20B95,999.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'llp-incorporation': {
    off_stat: '15 hrs of your time. Physical signature visit. No accountability.',
    on_stat: 'Save 15 hrs + \u20B914,000 in extra fees.',
    on_date_label: 'Guaranteed by',
    rows: [
      { task: 'Gathering documents', own: 'Physical signature visit. Wrong doc = full day gone.', ollvy_head: 'AI picks your exact list.', ollvy_badge: '98% go through.' },
      { task: 'Filing the registration', own: 'Wrong name = 10-day delay. Agreement errors are worse.', ollvy_head: 'Ollvy CS handles everything.', ollvy_badge: 'LLP number to your app.' },
      { task: 'Getting registered', own: '15-20 days. Unpredictable from here.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'Government correction notices', own: '\u20B92,000-5,000 per round. No cap.', ollvy_head: 'Unlimited revisions.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B912,000-25,000. Secretary, lawyer, digital signatures all separate.', ollvy_head: '\u20B97,999.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'msme-registration': {
    off_stat: '3 hours. One wrong code. Every MSME benefit gone.',
    on_stat: 'Save 3 hours + \u20B950,000 in scheme benefits.',
    on_date_label: 'Done by',
    rows: [
      { task: 'Gathering documents', own: 'Wrong industry code means every MSME benefit is invalid. No warning.', ollvy_head: 'AI picks your exact list.', ollvy_badge: 'Right code, first time.' },
      { task: 'Filing on Udyam', own: 'Overstate investment and you\'re disqualified. No warning.', ollvy_head: 'Ollvy checks eligibility first.', ollvy_badge: 'Certificate same day.' },
      { task: 'Getting registered', own: 'Errors after issuance = cancellation and restart.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'Udyam correction', own: 'Wrong details = cancel and refile.', ollvy_head: 'Ollvy handles it.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B9500-2,000. Wrong registration costs far more.', ollvy_head: '\u20B9999.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'trademark-registration': {
    off_stat: '20 hours of your time. Wrong category. Your trademark protects nothing.',
    on_stat: 'Save 20 hours + \u20B912,000 in objection fees.',
    on_date_label: 'Filed by',
    rows: [
      { task: 'Gathering documents', own: 'Wrong category means your trademark protects nothing you actually sell.', ollvy_head: 'Ollvy attorney searches for conflicts first.', ollvy_badge: 'Full search done before you pay.' },
      { task: 'Filing the application', own: 'Conflicting name found after filing means guaranteed rejection.', ollvy_head: 'Ollvy attorney files clean.', ollvy_badge: 'Application number same day.' },
      { task: 'Tracking the application', own: '12-18 months. No visibility. No shortcuts.', ollvy_head: 'Ollvy tracks every stage.', ollvy_badge: 'Response included.' },
      { task: 'Government objection', own: '\u20B95,000-15,000 extra. Wrong reply = it\'s abandoned.', ollvy_head: 'Ollvy attorney responds.', ollvy_badge: 'Included in the price.' },
      { task: 'What it actually costs', own: '\u20B915,000-40,000. Objections always billed separately.', ollvy_head: '\u20B96,999.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'gst-monthly': {
    off_stat: '5 hrs every month. No one chases your deadlines.',
    on_stat: 'Save 5 hrs/month + \u20B918,000/year in late fees.',
    on_date_label: 'Current cycle due',
    rows: [
      { task: 'Monthly reconciliation', own: 'Mismatch between your returns = government demands your credits back.', ollvy_head: 'Ollvy CA reconciles everything.', ollvy_badge: 'Every mismatch caught before filing.' },
      { task: 'Sales return by 11th, tax return by 20th', own: 'Miss one and \u20B950/day starts. Blocks next month too.', ollvy_head: 'Ollvy CA files both.', ollvy_badge: 'Every month. Before every deadline.' },
      { task: 'Getting it done on time', own: '11th and 20th. Every month. No grace period.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'Government notices', own: 'Credit reversal notices arrive 6 months later. Hard to fix.', ollvy_head: 'Ollvy CA handles every notice.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B91,500-3,000/month. More when things go wrong.', ollvy_head: '\u20B91,499/month.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'business-itr': {
    off_stat: '12 hours of your time. Wrong form, wrong numbers, no one checking.',
    on_stat: 'Save 12 hours + \u20B97,000 in refile costs.',
    on_date_label: 'Guaranteed by',
    rows: [
      { task: 'Profit & loss and balance sheet', own: 'Errors in your financials invite government scrutiny that lasts years.', ollvy_head: 'Ollvy CA reviews your financials.', ollvy_badge: 'Every number checked before filing.' },
      { task: 'Selecting form and filing', own: 'Three different forms for three entity types. Wrong one means a defective return and refiling.', ollvy_head: 'Ollvy CA picks the right form.', ollvy_badge: 'Acknowledgement same day.' },
      { task: 'Getting it filed on time', own: 'Jul 31 or Oct 31. Miss it = \u20B95,000 minimum.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'Income tax notice', own: 'Errors invite notices for up to 6 years.', ollvy_head: 'Ollvy CA handles any notice.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B94,000-15,000. Notices always extra.', ollvy_head: '\u20B94,999.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'mca-annual-filing': {
    off_stat: '12 hours. Two forms. Two deadlines. No one tracking either.',
    on_stat: 'Save 12 hours + \u20B910,000 in penalties.',
    on_date_label: 'Guaranteed by',
    rows: [
      { task: 'Financials and board resolution', own: 'Government rejects wrong format. Refile fees on top.', ollvy_head: 'Ollvy CS reviews your documents.', ollvy_badge: 'Ollvy CS formats everything correctly.' },
      { task: 'Both annual forms', own: '\u20B9100/day per form. Two forms. Two deadlines.', ollvy_head: 'Ollvy CS files both on time.', ollvy_badge: 'Guaranteed.' },
      { task: 'Getting it done on time', own: 'Financials form: 30 days after annual meeting. Company form: 60 days. Both separate.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'Government rejection notices', own: 'Format errors come back as notices weeks later.', ollvy_head: 'Ollvy CS handles everything.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B98,000-20,000. Director KYC always separate.', ollvy_head: '\u20B97,999.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'cloud-kitchen-setup': {
    off_stat: '30 hours. 3 licences. 3 consultants. Nobody coordinating.',
    on_stat: 'Save 30 hours + \u20B920,000 in extra consultants.',
    on_date_label: 'All 3 licences by',
    rows: [
      { task: 'Gathering documents', own: 'Three sets. One gap = failed FSSAI inspection.', ollvy_head: 'AI picks your exact list.', ollvy_badge: 'One checklist. All three.' },
      { task: 'Three licence applications', own: 'Three portals. Three officers. Zero coordination.', ollvy_head: 'Ollvy handles all three. One timeline.', ollvy_badge: 'All three.' },
      { task: 'Getting all three done', own: '4-8 weeks. Failed inspections add weeks more.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'FSSAI inspection failure', own: 'Re-inspection fee every time you fail.', ollvy_head: 'Ollvy preps the inspection.', ollvy_badge: 'Every query handled.' },
      { task: 'What it actually costs', own: '\u20B915,000-35,000. Three invoices. No coordination.', ollvy_head: 'Fixed bundle.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'tds-monthly-compliance': {
    off_stat: '6 hours every month. Wrong rate and nobody tells you.',
    on_stat: 'Save 6 hours/month + \u20B924,000/year in interest.',
    on_date_label: 'Current cycle due',
    rows: [
      { task: 'Monthly payment register', own: 'Wrong rate = 1.5%/month interest from deduction date.', ollvy_head: 'Ollvy CA reviews every payment.', ollvy_badge: 'Every rate checked before deposit.' },
      { task: 'Payment slips and quarterly returns', own: 'Wrong year on the payment slip means it gets stuck. Cannot be fixed.', ollvy_head: 'Ollvy CA prepares everything before the 7th.', ollvy_badge: 'Returns filed before every deadline.' },
      { task: 'Getting it done on time', own: '7th every month. Quarterly returns too. No grace.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'Department notices', own: 'Deduct too little and the entire expense gets disallowed as a tax deduction.', ollvy_head: 'Ollvy CA handles every notice.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B91,500-4,000/month. Form 16 always extra.', ollvy_head: '\u20B9999/month.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'business-pan': {
    off_stat: '4 hrs. One wrong detail. Rejected. Start over.',
    on_stat: 'Save 4 hrs + \u20B91,500 in rejection refiling.',
    on_date_label: 'Acknowledgement by',
    rows: [
      { task: 'Gathering documents', own: 'Wrong entity type = rejection. No partial fixes.', ollvy_head: 'AI picks your exact list.', ollvy_badge: 'CA checks before submitting.' },
      { task: 'Form 49A on NSDL', own: 'Director errors = rejection. Start from scratch.', ollvy_head: 'CA files it.', ollvy_badge: 'Acknowledgement same day.' },
      { task: 'Getting your PAN', own: 'No PAN = no bank account. Nothing moves.', ollvy_head: 'We give you the exact date.', ollvy_badge: 'Bank account today.' },
      { task: 'NSDL corrections', own: 'Wrong details post-allotment = separate application.', ollvy_head: 'CA handles it.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B9500-2,000. More when things go wrong.', ollvy_head: '\u20B9499.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'gst-cancellation': {
    off_stat: '8 hours. Wrong tax credit calculation. 18% interest. No one checking.',
    on_stat: 'Save 8 hours + \u20B95,000 in interest.',
    on_date_label: 'Guaranteed by',
    rows: [
      { task: 'Tax credits and remaining stock', own: 'Wrong calculation = government demand plus 18% interest.', ollvy_head: 'Ollvy CA reviews your credit balance.', ollvy_badge: 'Exact amount calculated before filing.' },
      { task: 'Final return and cancellation application', own: 'Errors in your final return are the most common reason for post-closure demands.', ollvy_head: 'Ollvy CA files both at once.', ollvy_badge: 'Before the deadline.' },
      { task: 'Getting it closed', own: 'Your tax liability keeps running until the final return is accepted.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'Officer approval queries', own: 'One wrong detail in the cancellation application = rejected outright.', ollvy_head: 'Ollvy CA monitors and responds.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B92,000-5,000. Final return almost always extra.', ollvy_head: '\u20B9999.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'gst-revocation': {
    off_stat: '30-day window. No second chance. GST number gone forever.',
    on_stat: 'Save 8 hours + \u20B96,000 in back-filings.',
    on_date_label: 'Filed by',
    rows: [
      { task: 'Order review and eligibility', own: 'Wrong read of the cancellation order = revocation rejected.', ollvy_head: 'Ollvy CA reviews your cancellation order.', ollvy_badge: 'Eligibility confirmed before you pay.' },
      { task: 'Clearing pending returns', own: 'Must clear all pending returns before the revocation goes through.', ollvy_head: 'Ollvy CA checks upfront.', ollvy_badge: 'Backlog quoted separately.' },
      { task: 'Revocation within 30 days', own: 'Miss it and your GST number is gone. Appeal is harder and more expensive.', ollvy_head: 'Ollvy CA files before the window closes.', ollvy_badge: 'Guaranteed.' },
      { task: 'Officer show cause notice', own: 'Wrong reply = GST number gone. One shot only.', ollvy_head: 'Ollvy CA responds within 24 hours.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B93,000-8,000. Pending returns always extra.', ollvy_head: '\u20B91,999.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'din-reactivation': {
    off_stat: '3 hours. Wrong process. September 30 passes. Penalty starts.',
    on_stat: 'Save 3 hours + \u20B92,000 in late penalty.',
    on_date_label: 'Director ID active by',
    rows: [
      { task: 'Checking Director ID status', own: 'Wrong reason diagnosed = entirely wrong process and wasted time.', ollvy_head: 'Ollvy CS checks your Director ID status.', ollvy_badge: 'Status confirmed before you pay.' },
      { task: 'Director KYC documents', own: 'Wrong document = rejection inside a tight window.', ollvy_head: 'Ollvy CS cross-checks everything.', ollvy_badge: 'Before filing.' },
      { task: 'Filing with the government', own: 'After September 30 = Rs. 5,000 penalty per year before reactivation.', ollvy_head: 'Ollvy CS files it.', ollvy_badge: 'Director ID active on time.' },
      { task: 'Government processing queries', own: 'One wrong field = rejection with no time to spare.', ollvy_head: 'Ollvy CS handles every query.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B9500-1,500. Penalty doubles it if you miss September 30.', ollvy_head: '\u20B9499.', ollvy_badge: 'That\'s it.' },
    ],
  },
  'company-name-change': {
    off_stat: '12 hours. Wrong sequence. Government blocks everything.',
    on_stat: 'Save 12 hours + \u20B98,000 in rework fees.',
    on_date_label: 'New certificate by',
    rows: [
      { task: 'Board resolution and shareholder meeting', own: 'Bad meeting format = resolution invalid. Back to start.', ollvy_head: 'Ollvy CS drafts all resolutions.', ollvy_badge: 'Every document reviewed before filing.' },
      { task: 'Name availability and reservation', own: 'Taken name = \u20B91,000 wasted. Start over.', ollvy_head: 'Ollvy CS checks first.', ollvy_badge: 'No wasted fees.' },
      { task: 'Filing the name change', own: 'Wrong sequence = government blocks the change entirely.', ollvy_head: 'Ollvy CS files in the right order.', ollvy_badge: 'New certificate to your app.' },
      { task: 'Government rejection notices', own: 'Any error = notice and re-submission.', ollvy_head: 'Ollvy CS handles everything.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '\u20B98,000-15,000. Post-change updates never included.', ollvy_head: '\u20B95,999.', ollvy_badge: 'Checklist included.' },
    ],
  },
  'iepf-consultation': {
    off_stat: 'Weeks of searching. No clear answer on what you can actually claim.',
    on_stat: 'Know what is claimable and how to get it - in 2 days.',
    on_date_label: 'Action plan by',
    rows: [
      { task: 'Finding your IEPF balance', own: 'The IEPF portal needs the exact company registration number and folio number. Most people search and find nothing - not because there is nothing, but because the search needs precise inputs they do not have.', ollvy_head: 'Ollvy expert searches the government portal and the IEPF database correctly and confirms what is actually there.', ollvy_badge: 'Done before the call.' },
      { task: 'Knowing your claim type', own: 'Direct claim, legal heir claim, physical certificate claim - each has a different process. No way to know which you are dealing with until something goes wrong partway through.', ollvy_head: 'Ollvy expert identifies your case type in the first 5 minutes of the call.', ollvy_badge: 'No surprises.' },
      { task: 'Understanding the claim form', own: '18 fields, a separate instruction manual, and government help pages referencing 2016 rules that have been amended since.', ollvy_head: 'Ollvy expert covers only what applies to your case.', ollvy_badge: '45 minutes, not 45 pages.' },
      { task: 'Document checklist', own: 'Government list has 14 items. Several probably do not apply to you. Two that do apply are not on the list.', ollvy_head: '5 to 9 items. Each explained in plain language, delivered in writing.', ollvy_badge: 'Specific to your case.' },
      { task: 'What it actually costs', own: 'Free to figure out yourself - if you get it right. Mistakes cost 2 to 3 months of delay and filing from scratch.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: 'That\'s it.' },
    ],
  },
}

export function DIYvsOllvy({ slug, guaranteedDate, isRetainer, totalFee }: DIYvsOllvyProps) {
  const [on, setOn] = useState(false)
  const data = DATA[slug]
  if (!data) return null

  // Override last row's ollvy_head with actual price if available
  if (totalFee && data.rows.length > 0) {
    const lastRow = data.rows[data.rows.length - 1]
    if (lastRow.task.toLowerCase().includes('cost')) {
      data.rows = data.rows.map((row, i) =>
        i === data.rows.length - 1
          ? { ...row, ollvy_head: `\u20B9${totalFee.toLocaleString('en-IN')}.` }
          : row
      )
    }
  }

  const dateLabel = isRetainer ? 'Current cycle due' : data.on_date_label
  const onStat = guaranteedDate
    ? `${data.on_stat} ${dateLabel} ${guaranteedDate}.`
    : data.on_stat

  // Replace {{GUARANTEE}} placeholder with actual date or fallback
  const guaranteeText = guaranteedDate
    ? `Guaranteed delivery by ${guaranteedDate}. Full refund if late.`
    : isRetainer
      ? 'Filed before every deadline. Full refund if late.'
      : 'Guaranteed delivery date. Full refund if late.'

  return (
    <div className="mb-10">

      <p className={cn(
        'text-xs uppercase tracking-widest mb-3 font-mono transition-colors duration-300',
        on ? 'text-[hsl(var(--ollvy-green-fg))]' : 'text-muted-foreground'
      )}>
        {on ? 'WITH OLLVY' : 'WITHOUT OLLVY'}
      </p>

      {/* Toggle header */}
      <div
        onClick={() => setOn(!on)}
        className={cn(
          'flex items-center justify-between px-6 py-5 rounded-t-xl border border-b-0 cursor-pointer transition-all duration-300 select-none',
          on
            ? 'bg-[hsl(var(--ollvy-green))]/10 border-[hsl(var(--ollvy-green))]/30'
            : 'bg-card border-border'
        )}
      >
        <div>
          <p className="text-xl sm:text-2xl font-mono font-bold leading-snug text-foreground">
            {on ? onStat : data.off_stat}
          </p>
        </div>

        {/* iOS toggle */}
        <div className={cn(
          'relative w-14 h-8 rounded-full transition-all duration-300 flex-shrink-0 ml-4',
          on ? 'bg-[hsl(var(--ollvy-green))]' : 'bg-muted-foreground/25'
        )}>
          <div className={cn(
            'absolute top-[3px] w-[26px] h-[26px] rounded-full bg-white shadow-md transition-all duration-300',
            on ? 'left-[27px]' : 'left-[3px]'
          )} />
        </div>
      </div>

      {/* Table — connected to toggle header */}
      <div className="rounded-b-xl border border-border overflow-hidden">
        {/* Desktop table */}
        <table className="w-full text-sm border-collapse hidden md:table">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="px-5 py-3 text-xs font-mono uppercase tracking-widest text-muted-foreground text-center font-semibold">
                What needs doing
              </th>
              <th className="px-5 py-3 text-xs font-mono uppercase tracking-widest text-muted-foreground text-center font-semibold border-l border-border">
                On your own
              </th>
              <th className="px-5 py-3 text-xs font-mono uppercase tracking-widest text-muted-foreground text-center font-semibold border-l border-border">
                With Ollvy
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} className={cn(
                'border-b border-border last:border-b-0 hover:bg-muted/10 transition-colors',
                i === data.rows.length - 1 && 'bg-muted/20'
              )}>
                <td className="px-5 py-4 font-semibold text-foreground align-top w-[26%]">
                  {row.task}
                </td>
                <td className="px-5 py-4 text-muted-foreground leading-relaxed align-top border-l border-border w-[34%]">
                  {row.own.includes('\n')
                    ? row.own.split('\n').filter(Boolean).map((line, j) => (
                        <span key={j}>{j > 0 && <br />}{line}</span>
                      ))
                    : row.own}
                </td>
                <td className={cn(
                  "px-5 py-4 align-top border-l border-border w-[40%] transition-colors duration-300",
                  on && "bg-[hsl(var(--ollvy-green))]/[0.04]"
                )}>
                  <p className="font-medium text-foreground flex items-start gap-1.5">
                    <Check size={14} className="text-[hsl(var(--ollvy-green))] shrink-0 mt-0.5" />
                    {row.ollvy_head === '{{GUARANTEE}}' ? guaranteeText : row.ollvy_head}
                  </p>
                  {row.ollvy_badge && (
                    <p className="text-xs text-[hsl(var(--ollvy-green-fg))] mt-1.5 font-mono ml-[20px]">
                      {row.ollvy_badge}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile: compact table */}
        <table className="w-full text-xs border-collapse md:hidden">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="px-2.5 py-2.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center font-medium">
                Task
              </th>
              <th className="px-2.5 py-2.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center font-medium border-l border-border">
                On your own
              </th>
              <th className="px-2.5 py-2.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center font-medium border-l border-border">
                With Ollvy
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} className={cn(
                'border-b border-border last:border-b-0',
                i === data.rows.length - 1 && 'bg-muted/20'
              )}>
                <td className="px-3 py-3 font-semibold text-foreground align-top text-[13px]">
                  {row.task}
                </td>
                <td className="px-3 py-3 text-muted-foreground leading-snug align-top border-l border-border text-[13px]">
                  {row.own.includes('\n')
                    ? row.own.split('\n').filter(Boolean).map((line, j) => (
                        <span key={j}>{j > 0 && <br />}{line}</span>
                      ))
                    : row.own}
                </td>
                <td className={cn(
                  "px-3 py-3 align-top border-l border-border text-[13px] transition-colors duration-300",
                  on && "bg-[hsl(var(--ollvy-green))]/[0.04]"
                )}>
                  <p className="font-medium text-foreground flex items-start gap-1">
                    <Check size={11} className="text-[hsl(var(--ollvy-green))] shrink-0 mt-0.5" />
                    {row.ollvy_head === '{{GUARANTEE}}' ? guaranteeText : row.ollvy_head}
                  </p>
                  {row.ollvy_badge && (
                    <p className="text-[11px] text-[hsl(var(--ollvy-green-fg))] mt-0.5 font-mono ml-[15px]">
                      {row.ollvy_badge}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
