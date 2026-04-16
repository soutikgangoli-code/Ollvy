'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { AlertCircle } from 'lucide-react'
import { ResultsPanel, InfoBanner } from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

function DirectorKYCCalculatorInner() {
  const searchParams = useSearchParams()

  const [numberOfDirectors, setNumberOfDirectors] = useState(
    safeParseInt(searchParams.get('directors'), 1)
  )
  const [isDINDeactivated, setIsDINDeactivated] = useState(
    searchParams.get('deactivated') === 'true'
  )

  const PENALTY_PER_DIRECTOR = 5000
  const totalPenalty = numberOfDirectors * PENALTY_PER_DIRECTOR

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('directors', numberOfDirectors.toString())
    params.set('deactivated', isDINDeactivated.toString())
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [numberOfDirectors, isDINDeactivated])

  const breakdown = useMemo(() => [
    {
      label: 'Penalty Breakdown',
      amount: totalPenalty,
      subItems: [
        { label: `Rs. 5,000 x ${numberOfDirectors} director${numberOfDirectors > 1 ? 's' : ''}`, amount: totalPenalty },
      ],
      statuteShort: 'Rule 12A',
      statuteFull: 'Rule 12A, Companies (Appointment and Qualification of Directors) Rules - DIR-3 KYC reactivation fee',
    },
  ], [totalPenalty, numberOfDirectors])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="directors">Directors who have not filed DIR-3 KYC</Label>
            <Input
              id="directors"
              type="number"
              min={1}
              max={50}
              value={numberOfDirectors}
              onChange={(e) => setNumberOfDirectors(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="max-w-[200px]"
            />
            <p className="text-xs text-muted-foreground">Rs. 5,000 per director - paid individually, not as a company</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Is the DIN already deactivated?</Label>
              <p className="text-xs text-muted-foreground mt-0.5">DINs deactivate automatically if DIR-3 KYC is not filed by the triennial deadline (next: June 30, 2028)</p>
            </div>
            <Switch checked={isDINDeactivated} onCheckedChange={setIsDINDeactivated} />
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              Key facts
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Now triennial (every 3 years). Next due June 30, 2028. Miss it and the DIN deactivates.</li>
              <li>Deactivated DIN = the director cannot sign any MCA form. All company filings stop.</li>
              <li>Reactivate by filing DIR-3 KYC Web with the Rs. 5,000 fee. Back active in 1-2 working days.</li>
              <li>Only DIR-3 KYC Web is permitted. The e-Form has been discontinued. OTP-based, no DSC, 2 minutes.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel
          total={totalPenalty}
          breakdown={breakdown}
          dueDate="Triennial - next due June 30, 2028"
          statute="Companies Act 2013, Rule 12A"
          ctaText="File DIR-3 KYC"
          ctaHref="/services/director-kyc"
          showCta={totalPenalty > 0}
          docChecklistHref="/tools/documents/private-limited-company"
          docChecklistText="Company compliance documents"
        >
          <InfoBanner
            title="Section 450 - additional penalty"
            body="Continued non-compliance after the deactivation can attract up to Rs. 50,000 in additional penalty."
          />
          {isDINDeactivated && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-100">
              <p className="font-semibold text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                DIN is deactivated
              </p>
              <ul className="text-sm mt-2 space-y-1 ml-6 list-disc">
                <li>This person cannot legally act as director</li>
                <li>Cannot sign any MCA form or filing</li>
                <li>Every company MCA filing is blocked until this is resolved</li>
                <li>File and pay the Rs. 5,000 fee. Active again in 24-48 hours.</li>
              </ul>
            </div>
          )}
        </ResultsPanel>
      </div>
    </div>
  )
}

export function CalculatorSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse">
      <div className="bg-muted rounded-lg h-[400px]" />
      <div className="bg-muted rounded-lg h-[350px]" />
    </div>
  )
}

export function DirectorKYCCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <DirectorKYCCalculatorInner />
    </Suspense>
  )
}
