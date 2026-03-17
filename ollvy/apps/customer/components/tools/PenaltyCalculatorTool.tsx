'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertCircle,
  AlertTriangle,
  Calculator,
  ChevronRight,
  FileText,
  Scale,
  TrendingUp,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type BusinessType,
  type CalculatorInputs,
  type CalculationResult,
  type RiskLevel,
} from '@/lib/penalty-calculator/types'
import {
  calculatePenalties,
  formatCurrency,
  getApplicableCompliances,
} from '@/lib/penalty-calculator/engine'

const RISK_STYLES: Record<RiskLevel, { bg: string; border: string; text: string; label: string }> = {
  low: {
    bg: 'bg-muted/50',
    border: 'border-border',
    text: 'text-muted-foreground',
    label: 'LOW RISK',
  },
  medium: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    label: 'MEDIUM RISK',
  },
  high: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-600 dark:text-orange-400',
    label: 'HIGH RISK',
  },
  critical: {
    bg: 'bg-ollvy-red/10',
    border: 'border-ollvy-red/30',
    text: 'text-ollvy-red',
    label: 'CRITICAL RISK',
  },
}

function formatTurnover(value: number): string {
  if (value >= 100) {
    return `${(value / 100).toFixed(value % 100 === 0 ? 0 : 1)} Cr`
  }
  return `${value} L`
}

interface PenaltyCalculatorToolProps {
  /** Which compliance to focus on (shows only this penalty in results) */
  focusCompliance?: 'gst' | 'mca' | 'director-kyc' | 'itr' | 'tds' | 'pf' | 'esic'
  /** Title for the calculator */
  title?: string
  /** Subtitle/description */
  subtitle?: string
  /** Statute reference */
  statute?: string
  /** Statute explanation */
  statuteExplanation?: string
  /** Show all compliances in results (overrides focusCompliance) */
  showAllCompliances?: boolean
  /** CTA button text */
  ctaText?: string
  /** CTA button href */
  ctaHref?: string
  /** FAQs to show below the calculator */
  faqs?: Array<{ question: string; answer: string }>
}

export function PenaltyCalculatorTool({
  focusCompliance,
  title = 'Penalty Calculator',
  subtitle = 'Real calculations based on Indian compliance law.',
  statute,
  statuteExplanation,
  showAllCompliances = false,
  ctaText = 'File Now',
  ctaHref = '/services',
  faqs = [],
}: PenaltyCalculatorToolProps) {
  // Phase 1 inputs (always visible)
  const [businessType, setBusinessType] = useState<BusinessType>('pvt_ltd')
  const [gstRegistered, setGstRegistered] = useState(true)
  const [hasEmployees, setHasEmployees] = useState(false)

  // Phase 2 inputs (conditional)
  const [annualTurnover, setAnnualTurnover] = useState([100]) // in lakhs
  const [employeeCount, setEmployeeCount] = useState('')

  // Phase 3 inputs (advanced options)
  const [daysLate, setDaysLate] = useState('30')
  const [outstandingTax, setOutstandingTax] = useState('')
  const [selectedCompliances, setSelectedCompliances] = useState<string[]>([])

  // Get applicable compliances based on current inputs
  const applicableCompliances = useMemo(() => {
    const inputs: CalculatorInputs = {
      businessType,
      gstRegistered,
      annualTurnover: annualTurnover[0],
      hasEmployees,
      employeeCount: parseInt(employeeCount) || 0,
      daysLate: parseInt(daysLate) || 0,
      outstandingTax: parseInt(outstandingTax) || 0,
      selectedCompliances: [],
    }
    return getApplicableCompliances(inputs)
  }, [businessType, gstRegistered, hasEmployees, employeeCount, annualTurnover, daysLate, outstandingTax])

  // Auto-select all applicable compliances when they change
  const handleSelectAllCompliances = () => {
    setSelectedCompliances(applicableCompliances.map((c) => c.slug))
  }

  // Calculate result
  const result = useMemo(() => {
    const compliancesToCalculate = showAllCompliances
      ? (selectedCompliances.length > 0 ? selectedCompliances : applicableCompliances.map((c) => c.slug))
      : (focusCompliance ? [focusCompliance] : applicableCompliances.map((c) => c.slug))

    const inputs: CalculatorInputs = {
      businessType,
      gstRegistered,
      annualTurnover: annualTurnover[0],
      hasEmployees,
      employeeCount: parseInt(employeeCount) || 0,
      daysLate: parseInt(daysLate) || 30,
      outstandingTax: parseInt(outstandingTax) || 0,
      selectedCompliances: compliancesToCalculate,
    }
    return calculatePenalties(inputs)
  }, [businessType, gstRegistered, annualTurnover, hasEmployees, employeeCount, daysLate, outstandingTax, selectedCompliances, applicableCompliances, focusCompliance, showAllCompliances])

  const toggleCompliance = (slug: string) => {
    setSelectedCompliances((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const focusedPenalty = focusCompliance && !showAllCompliances
    ? result.penalties.find(p => p.slug === focusCompliance)
    : null

  const displayPenalties = showAllCompliances ? result.penalties : (focusedPenalty ? [focusedPenalty] : result.penalties)
  const totalExposure = displayPenalties.reduce((sum, p) => sum + p.totalAmount, 0)
  const totalPenalty = displayPenalties.reduce((sum, p) => sum + p.penaltyAmount, 0)
  const totalInterest = displayPenalties.reduce((sum, p) => sum + p.interestAmount, 0)

  const getRiskLevel = (total: number): RiskLevel => {
    if (total <= 5000) return 'low'
    if (total <= 25000) return 'medium'
    if (total <= 100000) return 'high'
    return 'critical'
  }

  const riskLevel = getRiskLevel(totalExposure)

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Inputs Card */}
        <Card className="border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            {title}
          </h2>

          <div className="space-y-6">
            {/* Business Type */}
            <div className="space-y-1.5">
              <Label htmlFor="biz-type" className="text-sm font-medium">
                Business type
              </Label>
              <Select value={businessType} onValueChange={(v) => setBusinessType(v as BusinessType)}>
                <SelectTrigger id="biz-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pvt_ltd">Private Limited Company</SelectItem>
                  <SelectItem value="llp">LLP</SelectItem>
                  <SelectItem value="partnership">Partnership Firm</SelectItem>
                  <SelectItem value="sole_proprietor">Sole Proprietor / Individual</SelectItem>
                  <SelectItem value="not_registered">Not yet registered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* GST Registered */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">GST registered</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mandatory above ₹40L turnover (₹20L for services)
                </p>
              </div>
              <Switch checked={gstRegistered} onCheckedChange={setGstRegistered} />
            </div>

            {/* Annual Turnover (shows when GST registered) */}
            {gstRegistered && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Annual turnover</Label>
                  <span className="text-sm font-mono font-semibold text-foreground">
                    {formatTurnover(annualTurnover[0])}
                  </span>
                </div>
                <Slider
                  value={annualTurnover}
                  onValueChange={setAnnualTurnover}
                  min={0}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span>₹10 Cr</span>
                </div>
              </div>
            )}

            {/* Employees */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Have employees on payroll</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PF mandatory above 20 employees, ESIC above 10
                </p>
              </div>
              <Switch checked={hasEmployees} onCheckedChange={setHasEmployees} />
            </div>

            {/* Employee Count (shows when hasEmployees) */}
            {hasEmployees && (
              <div className="space-y-1.5">
                <Label htmlFor="employee-count" className="text-sm font-medium">
                  Number of employees
                </Label>
                <Input
                  id="employee-count"
                  type="number"
                  placeholder="e.g., 25"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  min={1}
                  className="max-w-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  {parseInt(employeeCount) >= 20
                    ? 'PF compliance required'
                    : parseInt(employeeCount) >= 10
                      ? 'ESIC compliance required'
                      : 'Enter employee count for PF/ESIC calculation'}
                </p>
              </div>
            )}

            {/* Advanced Options */}
            <Accordion type="single" collapsible defaultValue="advanced" className="w-full">
              <AccordionItem value="advanced" className="border-border">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Calculation details
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  {/* Days Late */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Days late</Label>
                      <span className="text-sm font-mono font-semibold text-foreground">
                        {daysLate || 30} days
                      </span>
                    </div>
                    <Slider
                      value={[parseInt(daysLate) || 30]}
                      onValueChange={(v) => setDaysLate(String(v[0]))}
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

                  {/* Outstanding Tax */}
                  <div className="space-y-1.5">
                    <Label htmlFor="outstanding-tax" className="text-sm font-medium">
                      Outstanding tax amount (optional)
                    </Label>
                    <div className="relative max-w-[200px]">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        ₹
                      </span>
                      <Input
                        id="outstanding-tax"
                        type="number"
                        placeholder="0"
                        value={outstandingTax}
                        onChange={(e) => setOutstandingTax(e.target.value)}
                        min={0}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For interest calculations
                    </p>
                  </div>

                  {/* Select Specific Compliances (only when showing all) */}
                  {showAllCompliances && applicableCompliances.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Select compliances to calculate
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleSelectAllCompliances}
                          className="text-xs h-7"
                        >
                          Select all
                        </Button>
                      </div>
                      <div className="grid gap-3">
                        {applicableCompliances.map((compliance) => (
                          <label
                            key={compliance.slug}
                            className="flex items-start gap-3 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedCompliances.includes(compliance.slug)}
                              onCheckedChange={() => toggleCompliance(compliance.slug)}
                              className="mt-0.5"
                            />
                            <div>
                              <span className="text-sm font-medium">{compliance.label}</span>
                              <p className="text-xs text-muted-foreground">
                                {compliance.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Card>

        {/* Results Panel */}
        <Card className={cn('p-6', RISK_STYLES[riskLevel].bg)}>
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Penalty Breakdown
          </h2>

          {businessType === 'not_registered' ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-muted">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <p className="font-semibold text-foreground">
                No penalties yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                The clock starts when you register. Getting set up right from day one means your first month isn't already behind.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/services?utm_source=tools&utm_medium=penalty_calc">
                  Incorporate with Ollvy
                </Link>
              </Button>
            </div>
          ) : displayPenalties.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <AlertCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <p className="font-semibold text-foreground">Not applicable</p>
              <p className="text-sm text-muted-foreground mt-2">
                This compliance doesn't apply to your business type. Update your business profile to see applicable penalties.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Total */}
              <div className="text-center py-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  TOTAL PENALTY
                </p>
                <p className="text-4xl font-bold font-mono text-foreground">
                  {formatCurrency(totalExposure)}
                </p>
                <div className="flex items-center justify-center gap-4 mt-3 text-sm text-muted-foreground">
                  {totalPenalty > 0 && (
                    <span>
                      Penalties:{' '}
                      <span className="font-mono font-semibold text-foreground">
                        {formatCurrency(totalPenalty)}
                      </span>
                    </span>
                  )}
                  {totalInterest > 0 && (
                    <>
                      <span className="text-border">|</span>
                      <span>
                        Interest:{' '}
                        <span className="font-mono font-semibold text-foreground">
                          {formatCurrency(totalInterest)}
                        </span>
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <AlertTriangle className={cn('h-4 w-4', RISK_STYLES[riskLevel].text)} />
                  <span className={cn('text-sm font-semibold uppercase', RISK_STYLES[riskLevel].text)}>
                    {RISK_STYLES[riskLevel].label}
                  </span>
                </div>
              </div>

              {/* Individual Penalty Cards */}
              {displayPenalties.map((penalty) => (
                <div key={penalty.slug} className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-foreground">
                      {penalty.serviceName}
                    </span>
                    <span className="font-mono font-bold text-ollvy-red">
                      {formatCurrency(penalty.totalAmount)}
                    </span>
                  </div>
                  {penalty.penaltyAmount > 0 && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Penalty</span>
                      <span className="font-mono">{formatCurrency(penalty.penaltyAmount)}</span>
                    </div>
                  )}
                  {penalty.interestAmount > 0 && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Interest</span>
                      <span className="font-mono">{formatCurrency(penalty.interestAmount)}</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{penalty.explanation}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1 italic">{penalty.statute}</p>
                </div>
              ))}

              {/* CTA */}
              <Button className="w-full" asChild>
                <Link href={`${ctaHref}?utm_source=tools&utm_medium=penalty_calc`}>
                  {ctaText}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Statute Reference */}
      {statute && statuteExplanation && (
        <Card className="mt-8 p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">{statute}</h3>
              <p className="text-sm text-muted-foreground mt-1">{statuteExplanation}</p>
            </div>
          </div>
        </Card>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
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
      )}

      {/* Final CTA */}
      <Card className="mt-12 p-8 text-center border-primary/20 bg-primary/5">
        <h3 className="text-xl font-semibold text-foreground">Need help with compliance?</h3>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Ollvy handles your compliance from start to finish. Stop penalty accrual today.
        </p>
        <Button className="mt-6" size="lg" asChild>
          <Link href={`${ctaHref}?utm_source=tools&utm_medium=penalty_calc&utm_content=cta`}>
            {ctaText}
          </Link>
        </Button>
      </Card>
    </>
  )
}
