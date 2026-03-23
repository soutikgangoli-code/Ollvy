'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { AlertCircle } from 'lucide-react'
import {
  ResultsPanel,
  InfoBanner,
} from '@/components/penalty-calculator'
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
        { label: `Rs.5,000 x ${numberOfDirectors} director${numberOfDirectors > 1 ? 's' : ''}`, amount: totalPenalty },
      ],
      statuteShort: 'Rule 12A',
      statuteFull: 'Rule 12A of Companies (Appointment and Qualification of Directors) Rules - DIR-3 KYC late fee',
    },
  ], [totalPenalty, numberOfDirectors])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      {/* Input Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
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
              Each director pays Rs.5,000 separately
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

          {/* Info Panel */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              Important Information
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>DIR-3 KYC must be filed annually by September 30 for every DIN holder allotted a DIN on or before March 31 of the financial year.</li>
              <li>A deactivated DIN blocks all MCA filings - the company cannot file any form (AOC-4, MGT-7, share allotments, charge creation) until every director&apos;s DIN is reactivated.</li>
              <li>Reactivation: File DIR-3 KYC with late fee of Rs.5,000. MCA processes within 24-48 business hours.</li>
              <li>From FY 2019-20: Directors with mobile and email linked to MCA must also file DIR-3 KYC-Web annually. Same Rs.5,000 late fee applies.</li>
            </ul>
          </div>
        </div>
      </div>

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
            body="Up to Rs.50,000 under Section 450 for continued non-compliance"
          />

          {/* DIN Deactivated Status */}
          {isDINDeactivated && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-100">
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
