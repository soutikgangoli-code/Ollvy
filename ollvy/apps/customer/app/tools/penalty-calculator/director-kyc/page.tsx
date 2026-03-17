'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Calculator, AlertCircle } from 'lucide-react'
import {
  ResultsPanel,
  InfoBanner,
} from '@/components/penalty-calculator'

// FAQs from Section 14.4
const faqs = [
  {
    question: 'What is DIR-3 KYC?',
    answer: 'DIR-3 KYC is an annual KYC form filed with MCA by every individual who holds a DIN (Director Identification Number). It must be filed by September 30 every year to keep the DIN active.',
  },
  {
    question: 'What is the penalty for not filing DIR-3 KYC?',
    answer: 'The penalty is a flat ₹5,000 per director — regardless of how many days overdue. Whether filed 1 day late or 3 years late, the fee is ₹5,000.',
  },
  {
    question: 'What happens to the DIN if KYC is not filed?',
    answer: 'MCA automatically deactivates the DIN on October 1 (the day after the September 30 deadline). A deactivated DIN cannot be used to sign or file any MCA form.',
  },
  {
    question: 'How do I reactivate a deactivated DIN?',
    answer: 'File DIR-3 KYC with the ₹5,000 late fee on the MCA portal. MCA reactivates the DIN within 24–48 business hours.',
  },
  {
    question: 'What is DIR-3 KYC-Web?',
    answer: 'DIR-3 KYC-Web is an online verification for directors whose details are unchanged from the previous year. The same September 30 deadline applies and the same ₹5,000 late fee applies.',
  },
  {
    question: 'Does DIR-3 KYC need to be filed for a disqualified director?',
    answer: 'Yes. Even disqualified directors hold a DIN and must file DIR-3 KYC annually to keep it active.',
  },
  {
    question: 'If a company has 3 directors and none has filed KYC, what is the total penalty?',
    answer: '₹15,000 — ₹5,000 per director × 3. Each director files and pays separately.',
  },
  {
    question: 'Can a company function if director DINs are deactivated?',
    answer: 'No. The company cannot file any MCA forms while any director\'s DIN is deactivated. The company is effectively locked out of all ROC filings.',
  },
]

function DirectorKYCCalculator() {
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [numberOfDirectors, setNumberOfDirectors] = useState(
    parseInt(searchParams.get('directors') || '1', 10)
  )
  const [isDINDeactivated, setIsDINDeactivated] = useState(
    searchParams.get('deactivated') === 'true'
  )

  // Calculate penalty - flat ₹5,000 per director
  const PENALTY_PER_DIRECTOR = 5000
  const totalPenalty = numberOfDirectors * PENALTY_PER_DIRECTOR

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('directors', numberOfDirectors.toString())
    params.set('deactivated', isDINDeactivated.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [numberOfDirectors, isDINDeactivated])

  // Breakdown for ResultsPanel
  const breakdown = useMemo(() => [
    {
      label: 'Penalty Breakdown',
      amount: totalPenalty,
      subItems: [
        { label: `₹5,000 × ${numberOfDirectors} director${numberOfDirectors > 1 ? 's' : ''}`, amount: totalPenalty },
      ],
      statuteShort: 'Rule 12A',
      statuteFull: 'Rule 12A of Companies (Appointment and Qualification of Directors) Rules — DIR-3 KYC late fee',
    },
  ], [totalPenalty, numberOfDirectors])

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to calculate Director KYC penalty',
            step: [
              { '@type': 'HowToStep', name: 'Enter number of directors', text: 'Specify how many directors have pending KYC' },
              { '@type': 'HowToStep', name: 'Check DIN status', text: 'Indicate if any DINs are deactivated' },
              { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty (₹5,000 per director)' },
            ],
          }),
        }}
      />

      {/* JSON-LD Schema - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
              { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
              { '@type': 'ListItem', position: 4, name: 'Director KYC', item: 'https://ollvy.com/tools/penalty-calculator/director-kyc' },
            ],
          }),
        }}
      />

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
        {/* Input Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            Director KYC (DIR-3 KYC) Penalty Calculator
          </h2>

          <div className="space-y-6">
            {/* Number of Directors */}
            <div className="space-y-1.5">
              <Label htmlFor="directors">Number of Directors with Pending KYC</Label>
              <Input
                id="directors"
                type="number"
                min={1}
                max={50}
                value={numberOfDirectors}
                onChange={(e) => setNumberOfDirectors(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="max-w-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Each director pays ₹5,000 separately
              </p>
            </div>

            {/* Is DIN Deactivated */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Is DIN Currently Deactivated?</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  DINs are deactivated after September 30 if KYC is not filed
                </p>
              </div>
              <Switch checked={isDINDeactivated} onCheckedChange={setIsDINDeactivated} />
            </div>

            {/* Info Panel - Always visible */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="font-medium text-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                Important Information
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>DIR-3 KYC must be filed annually by September 30 for every DIN holder allotted a DIN on or before March 31 of the financial year.</li>
                <li>A deactivated DIN blocks all MCA filings — the company cannot file any form (AOC-4, MGT-7, share allotments, charge creation) until every director&apos;s DIN is reactivated.</li>
                <li>Reactivation: File DIR-3 KYC with late fee of ₹5,000. MCA processes within 24–48 business hours.</li>
                <li>From FY 2019-20: Directors with mobile and email linked to MCA must also file DIR-3 KYC-Web annually. Same ₹5,000 late fee applies.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Results Section */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ResultsPanel
            total={totalPenalty}
            breakdown={breakdown}
            dueDate="30 September every year"
            statute="Companies Act 2013, Rule 12A of Companies (Appointment and Qualification of Directors) Rules"
            ctaText="File DIR-3 KYC"
            ctaHref="/services/director-kyc"
            showCta={totalPenalty > 0}
          >
            {/* Additional Risk Warning */}
            <InfoBanner
              title="Additional Risk"
              body="Up to ₹50,000 under Section 450 for continued non-compliance"
            />

            {/* DIN Deactivated Status */}
            {isDINDeactivated && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-900">
                <p className="font-semibold text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  DIN STATUS: Deactivated
                </p>
                <ul className="text-sm mt-2 space-y-1 ml-6 list-disc">
                  <li>Cannot act as director</li>
                  <li>Cannot sign MCA forms</li>
                  <li>All company MCA filings blocked until reactivation</li>
                  <li>Reactivation: 24-48 hours after filing + payment</li>
                </ul>
              </div>
            )}
          </ResultsPanel>
        </div>
      </div>

      {/* SEO Content - H2 Sections */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is DIR-3 KYC and why is it mandatory?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            DIR-3 KYC (Director KYC) is an annual verification form that every Director
            Identification Number (DIN) holder must file with the Ministry of Corporate Affairs.
            This requirement was introduced to ensure that directors&apos; contact details remain
            updated in the government database and to verify the identity of directors annually.
            The filing is mandatory for all directors who were allotted a DIN on or before
            March 31 of the current financial year, regardless of whether they are currently
            associated with any company or not. The deadline is September 30 every year.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What happens if DIR-3 KYC is not filed by September 30?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            If DIR-3 KYC is not filed by September 30, the Director Identification Number (DIN)
            is automatically marked as &quot;Deactivated due to non-filing of DIR-3 KYC&quot; on October 1.
            A deactivated DIN means the director cannot sign any MCA e-forms, cannot act as a
            director for any company, and the company cannot file any forms requiring that
            director&apos;s signature. This effectively freezes all MCA compliance for the company
            until the DIN is reactivated. The late filing fee is a flat ₹5,000 per director,
            regardless of how late the filing is made.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            DIN deactivation — how to reactivate your DIN
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            To reactivate a deactivated DIN, the director must file DIR-3 KYC with the late fee
            of ₹5,000 through the MCA portal. The form requires the director&apos;s personal details,
            mobile number, email address, and digital signature. Once filed and the fee is paid,
            MCA typically processes the reactivation within 24–48 business hours. During this
            processing time, the DIN remains deactivated. It&apos;s important to file as early as
            possible to avoid delays in company compliance filings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            DIR-3 KYC vs DIR-3 KYC-Web — what is the difference?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            There are two forms for director KYC compliance:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>
              <strong>DIR-3 KYC:</strong> The original eForm filed using DSC (Digital Signature Certificate).
              Required when filing for the first time or when updating any personal details like mobile,
              email, or address.
            </li>
            <li>
              <strong>DIR-3 KYC-Web:</strong> A web-based OTP verification introduced from FY 2019-20.
              Can be used when no details have changed from the previous year. Requires OTP verification
              on the registered mobile and email.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Both forms have the same deadline (September 30) and the same late fee (₹5,000).
            DIR-3 KYC-Web is simpler and faster if your details are unchanged.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to file DIR-3 KYC on MCA portal — step by step
          </h2>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2">
            <li>Login to the MCA portal at mca.gov.in</li>
            <li>Navigate to MCA Services &gt; DIN Services &gt; DIR-3 KYC</li>
            <li>Enter your DIN number and verify with OTP</li>
            <li>Fill in the form with your personal details</li>
            <li>Upload your DSC (Digital Signature Certificate) to sign the form</li>
            <li>Pay the fee (₹0 if on time, ₹5,000 if after September 30)</li>
            <li>Submit and download the acknowledgment</li>
          </ol>
          <p className="text-muted-foreground leading-relaxed mt-4">
            For DIR-3 KYC-Web (if details unchanged): Login, go to DIN Services, select KYC-Web,
            verify OTP on mobile and email, confirm details are correct, and submit. No DSC required.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Need help filing?{' '}
            <Link href="/services/director-kyc" className="text-emerald-600 hover:underline">
              Ollvy can file DIR-3 KYC for you — ₹499 per director
            </Link>.
          </p>
        </section>
      </div>

      {/* FAQs Section */}
      <div className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border pb-6 last:border-0">
              <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Tools */}
      <div className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Related Tools</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/tools/penalty-calculator/mca-annual-filing" className="block">
            <Card className="p-4 hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">MCA Annual Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate AOC-4 and MGT-7 late filing penalties
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/gst-late-filing" className="block">
            <Card className="p-4 hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">GST Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate GSTR-1, GSTR-3B, and GSTR-9 penalties
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </>
  )
}

// Loading fallback for Suspense
function CalculatorSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse">
      <div className="bg-muted rounded-lg h-[400px]" />
      <div className="bg-muted rounded-lg h-[350px]" />
    </div>
  )
}

export default function DirectorKYCPenaltyPage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <DirectorKYCCalculator />
    </Suspense>
  )
}
