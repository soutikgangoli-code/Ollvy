'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  AlertTriangle,
  Calculator,
  ChevronRight,
  Scale,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePostHogEvents } from '@/lib/hooks/usePostHogEvents'

interface PenaltyResult {
  penaltyAmount: number
  interestAmount: number
  totalAmount: number
  explanation: string
}

interface PenaltyCalculatorPageProps {
  title: string
  subtitle: string
  description: string
  statute: string
  statuteExplanation: string
  dueDate?: string
  calculatePenalty: (daysLate: number, outstandingAmount: number) => PenaltyResult
  showOutstandingInput?: boolean
  outstandingLabel?: string
  outstandingPlaceholder?: string
  ctaTitle: string
  ctaDescription: string
  ctaButtonText: string
  ctaButtonHref: string
  faqs: { question: string; answer: string }[]
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function PenaltyCalculatorPage({
  title,
  subtitle,
  description,
  statute,
  statuteExplanation,
  dueDate,
  calculatePenalty,
  showOutstandingInput = true,
  outstandingLabel = 'Outstanding tax amount',
  outstandingPlaceholder = '50000',
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  ctaButtonHref,
  faqs,
}: PenaltyCalculatorPageProps) {
  const [daysLate, setDaysLate] = useState([30])
  const [outstandingAmount, setOutstandingAmount] = useState('')
  const [showResult, setShowResult] = useState(false)
  const pathname = usePathname()
  const toolSlug = pathname?.split('/').filter(Boolean).pop() ?? 'unknown'
  const { trackToolInteraction } = usePostHogEvents()

  const result = calculatePenalty(daysLate[0], parseInt(outstandingAmount) || 0)

  const getRiskLevel = (total: number) => {
    if (total <= 5000) return { level: 'Low', color: 'text-muted-foreground', bg: 'bg-muted/50' }
    if (total <= 25000) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-500/10' }
    if (total <= 100000) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-500/10' }
    return { level: 'Critical', color: 'text-ollvy-red', bg: 'bg-ollvy-red/10' }
  }

  const risk = getRiskLevel(result.totalAmount)

  return (
    <div className="py-24">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            PENALTY CALCULATOR
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Calculate Your Penalty
            </h2>

            <div className="space-y-6">
              {/* Days Late Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Days late</Label>
                  <span className="text-sm font-mono font-semibold text-foreground">
                    {daysLate[0]} days
                  </span>
                </div>
                <Slider
                  value={daysLate}
                  onValueChange={(value) => {
                    setDaysLate(value)
                    setShowResult(true)
                  }}
                  min={1}
                  max={365}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 day</span>
                  <span>365 days</span>
                </div>
              </div>

              {/* Outstanding Amount */}
              {showOutstandingInput && (
                <div className="space-y-2">
                  <Label htmlFor="outstanding" className="text-sm font-medium">
                    {outstandingLabel}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      Rs.
                    </span>
                    <Input
                      id="outstanding"
                      type="number"
                      placeholder={outstandingPlaceholder}
                      value={outstandingAmount}
                      onChange={(e) => {
                        setOutstandingAmount(e.target.value)
                        setShowResult(true)
                      }}
                      min={0}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the tax amount that remains unpaid (if any)
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => {
                  setShowResult(true)
                  trackToolInteraction('penalty_calculator', toolSlug, 'result_shown', {
                    days_late: daysLate[0],
                    outstanding_amount: parseInt(outstandingAmount) || 0,
                    total_penalty: result.totalAmount,
                    risk_level: risk.level,
                  })
                }}
              >
                Calculate Penalty
              </Button>
            </div>
          </Card>

          {/* Result Card */}
          <Card className={cn('p-6', showResult ? risk.bg : 'bg-muted/30')}>
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Penalty Breakdown
            </h2>

            {showResult ? (
              <div className="space-y-6">
                {/* Total */}
                <div className="text-center py-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    TOTAL PENALTY
                  </p>
                  <p className="text-4xl font-bold font-mono text-foreground">
                    {formatCurrency(result.totalAmount)}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <AlertTriangle className={cn('h-4 w-4', risk.color)} />
                    <span className={cn('text-sm font-semibold uppercase', risk.color)}>
                      {risk.level} Risk
                    </span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 pt-4 border-t border-border">
                  {result.penaltyAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Late filing penalty</span>
                      <span className="font-mono font-medium">{formatCurrency(result.penaltyAmount)}</span>
                    </div>
                  )}
                  {result.interestAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Interest on unpaid tax</span>
                      <span className="font-mono font-medium">{formatCurrency(result.interestAmount)}</span>
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-lg bg-background border border-border">
                  <p className="text-sm text-muted-foreground">{result.explanation}</p>
                </div>

                {/* CTA */}
                <Button className="w-full" asChild>
                  <Link
                    href={ctaButtonHref}
                    onClick={() =>
                      trackToolInteraction('penalty_calculator', toolSlug, 'cta_clicked', {
                        cta_position: 'result_card',
                        destination: ctaButtonHref,
                        total_penalty: result.totalAmount,
                      })
                    }
                  >
                    {ctaButtonText}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Adjust the values on the left to calculate your penalty</p>
              </div>
            )}
          </Card>
        </div>

        {/* Legal Reference */}
        <Card className="mt-8 p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">{statute}</h3>
              <p className="text-sm text-muted-foreground mt-1">{statuteExplanation}</p>
            </div>
          </div>
        </Card>

        {/* FAQs */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <Card className="mt-12 p-8 text-center border-primary/20 bg-primary/5">
          <h3 className="text-xl font-semibold text-foreground">{ctaTitle}</h3>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">{ctaDescription}</p>
          <Button className="mt-6" size="lg" asChild>
            <Link
              href={ctaButtonHref}
              onClick={() =>
                trackToolInteraction('penalty_calculator', toolSlug, 'cta_clicked', {
                  cta_position: 'final_card',
                  destination: ctaButtonHref,
                })
              }
            >
              {ctaButtonText}
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}
