'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
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

export function PenaltyCalculator() {
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

  // Result state
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<CalculationResult | null>(null)

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

  const calculate = () => {
    // If results are showing, toggle them off
    if (showResults) {
      setShowResults(false)
      return
    }

    const inputs: CalculatorInputs = {
      businessType,
      gstRegistered,
      annualTurnover: annualTurnover[0],
      hasEmployees,
      employeeCount: parseInt(employeeCount) || 0,
      daysLate: parseInt(daysLate) || 30,
      outstandingTax: parseInt(outstandingTax) || 0,
      selectedCompliances: selectedCompliances.length > 0
        ? selectedCompliances
        : applicableCompliances.map((c) => c.slug),
    }
    const calculationResult = calculatePenalties(inputs)
    setResult(calculationResult)
    setShowResults(true)
  }

  const toggleCompliance = (slug: string) => {
    setSelectedCompliances((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  return (
    <section className="bg-card py-24">
      <div className="container">
        {/* Section Label */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
          PENALTY CALCULATOR
        </p>

        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
          The actual cost of missing a deadline.
        </h2>

        {/* Subheading */}
        <p className="text-base text-muted-foreground text-center max-w-[480px] mx-auto mt-4">
          Real calculations based on Indian compliance law. Enter your business details to see your
          exact risk exposure.
        </p>

        {/* Inputs Card */}
        <Card className="border border-border bg-card p-8 mt-12 max-w-[480px] mx-auto">
          <div className="space-y-6">
            {/* Phase 1: Basic Business Info */}
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
            </div>

            {/* Phase 2: Conditional Inputs */}
            <div className="space-y-6">
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
            </div>

            {/* Phase 3: Advanced Options (Accordion) */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced" className="border-border">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Advanced calculation options
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  {/* Days Late */}
                  <div className="space-y-1.5">
                    <Label htmlFor="days-late" className="text-sm font-medium">
                      Days late
                    </Label>
                    <Input
                      id="days-late"
                      type="number"
                      placeholder="30"
                      value={daysLate}
                      onChange={(e) => setDaysLate(e.target.value)}
                      min={1}
                      className="max-w-[200px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days past the due date
                    </p>
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
                      For interest calculations on GST/TDS/ITR
                    </p>
                  </div>

                  {/* Select Specific Compliances */}
                  {applicableCompliances.length > 0 && (
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

            <Button
              className="w-full mt-6 transition-transform active:scale-[0.98]"
              onClick={calculate}
              aria-controls="penalty-output"
              aria-expanded={showResults}
            >
              {showResults ? 'Hide Results' : 'Calculate My Risk Exposure'}
            </Button>
          </div>
        </Card>

        {/* Penalty Output */}
        <div
          id="penalty-output"
          role="status"
          aria-live="polite"
          className={cn(
            'max-w-[480px] mx-auto transition-all duration-300 overflow-hidden',
            showResults
              ? 'opacity-100 mt-6 max-h-[2000px]'
              : 'opacity-0 mt-0 max-h-0 pointer-events-none'
          )}
        >
          {businessType === 'not_registered' ? (
            <Card className="border border-border bg-card p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-muted">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <p className="font-semibold text-foreground">
                No penalties yet - but the clock starts when you register.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                The moment you incorporate or get a GSTIN, these obligations begin. There's no
                grace period for new registrations. Getting set up right from day one means your
                first month isn't already behind.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/services">
                  Incorporate correctly from day one
                </Link>
              </Button>
            </Card>
          ) : result && result.penalties.length > 0 ? (
            <div className="space-y-4">
              {/* Total Risk Summary Card */}
              <Card
                className={cn(
                  'border p-6',
                  RISK_STYLES[result.riskLevel].border,
                  RISK_STYLES[result.riskLevel].bg
                )}
              >
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    TOTAL RISK EXPOSURE
                  </p>
                  <p className="text-4xl md:text-5xl font-bold font-mono text-foreground">
                    {formatCurrency(result.totalExposure)}
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span>
                      Penalties:{' '}
                      <span className="font-mono font-semibold text-foreground">
                        {formatCurrency(result.totalPenalty)}
                      </span>
                    </span>
                    <span className="text-border">|</span>
                    <span>
                      Interest:{' '}
                      <span className="font-mono font-semibold text-foreground">
                        {formatCurrency(result.totalInterest)}
                      </span>
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <AlertTriangle
                      className={cn('h-4 w-4', RISK_STYLES[result.riskLevel].text)}
                    />
                    <span
                      className={cn(
                        'text-sm font-semibold uppercase tracking-wide',
                        RISK_STYLES[result.riskLevel].text
                      )}
                    >
                      {RISK_STYLES[result.riskLevel].label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      - Based on {daysLate || 30} days late
                    </span>
                  </div>
                </div>
              </Card>

              {/* Individual Penalty Cards */}
              <div className="space-y-3">
                {result.penalties.map((penalty) => (
                  <Card
                    key={penalty.slug}
                    className={cn(
                      'border p-4',
                      penalty.totalAmount > 50000
                        ? 'border-ollvy-red/20 bg-ollvy-red/5'
                        : penalty.totalAmount > 10000
                          ? 'border-orange-500/20 bg-orange-500/5'
                          : 'border-border bg-card'
                    )}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Scale className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-semibold text-sm text-foreground">
                            {penalty.serviceName}
                          </span>
                        </div>

                        {penalty.dueDate && (
                          <p className="text-xs text-muted-foreground mb-1">
                            Due date: {new Date(penalty.dueDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            <span className="text-red-400">({penalty.daysLate} days late)</span>
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {penalty.explanation}
                        </p>

                        <p className="text-xs text-muted-foreground/70 mt-2 italic">
                          {penalty.statute}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-right">
                          {penalty.penaltyAmount > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Penalty:{' '}
                              <span className="font-mono">
                                {formatCurrency(penalty.penaltyAmount)}
                              </span>
                            </div>
                          )}
                          {penalty.interestAmount > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Interest:{' '}
                              <span className="font-mono">
                                {formatCurrency(penalty.interestAmount)}
                              </span>
                            </div>
                          )}
                          <div className="font-mono font-bold text-base text-red-400 mt-1">
                            {formatCurrency(penalty.totalAmount)}
                          </div>
                        </div>

                        <Button size="sm" variant="outline" className="gap-1" asChild>
                          <Link
                            href={`/services/${penalty.serviceSlug}`}
                          >
                            Fix This
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Summary Action Card */}
              <Card className="border border-border bg-card p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Get all {result.penalties.length} compliances filed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stop penalty accrual today. CA assigned within 24 hours.
                      </p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/services">
                      View All Services
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          ) : result && result.penalties.length === 0 ? (
            <Card className="border border-border bg-card p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <AlertCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <p className="font-semibold text-foreground">No penalties calculated</p>
              <p className="text-sm text-muted-foreground mt-2">
                Select at least one compliance type in the advanced options to calculate penalties,
                or check your business profile settings.
              </p>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  )
}
