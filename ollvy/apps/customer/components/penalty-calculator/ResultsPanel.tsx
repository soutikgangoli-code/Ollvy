'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Download, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatutoryRef } from './StatutoryRef'
import { cn } from '@/lib/utils'

interface BreakdownItem {
  label: string
  amount: number
  subItems?: { label: string; amount: number }[]
  statuteShort?: string
  statuteFull?: string
}

interface ResultsPanelProps {
  total: number
  breakdown: BreakdownItem[]
  dueDate?: string
  statute?: string
  ctaText?: string
  ctaHref?: string
  showCta?: boolean
  onDownload?: () => void
  className?: string
  children?: React.ReactNode // For warning banners
}

// Format currency in Indian style
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Get color based on penalty severity
function getPenaltyColor(amount: number): string {
  if (amount === 0) return 'text-muted-foreground'
  if (amount < 5000) return 'text-amber-600'
  if (amount < 25000) return 'text-orange-600'
  return 'text-red-600'
}

export function ResultsPanel({
  total,
  breakdown,
  dueDate,
  statute,
  ctaText = 'File Now',
  ctaHref = '/services',
  showCta = true,
  onDownload,
  className,
  children,
}: ResultsPanelProps) {
  const todayDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
  }, [])

  const handleDownload = () => {
    if (onDownload) {
      onDownload()
      return
    }
    // Default: print to PDF
    window.print()
  }

  const penaltyColor = getPenaltyColor(total)

  return (
    <Card className={cn('p-6', className)}>
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          TOTAL PENALTY
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Calculated as of {todayDate}
        </p>
        <p className={cn('text-4xl font-bold', penaltyColor)}>
          {formatCurrency(total)}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Breakdown */}
      <div className="space-y-4">
        {breakdown.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                {item.statuteShort && item.statuteFull && (
                  <StatutoryRef
                    shortText={item.statuteShort}
                    fullText={item.statuteFull}
                  />
                )}
              </div>
              <span className="text-sm font-mono font-semibold text-foreground">
                {formatCurrency(item.amount)}
              </span>
            </div>

            {/* Sub-items */}
            {item.subItems && item.subItems.length > 0 && (
              <div className="ml-4 space-y-1">
                {item.subItems.map((sub, subIndex) => (
                  <div key={subIndex} className="flex justify-between text-xs text-muted-foreground">
                    <span>{sub.label}</span>
                    <span className="font-mono">{formatCurrency(sub.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Divider before total */}
      <div className="border-t border-border my-4" />

      {/* Total row */}
      <div className="flex justify-between items-center font-semibold">
        <span className="text-foreground">Total</span>
        <span className={cn('text-lg font-mono', penaltyColor)}>{formatCurrency(total)}</span>
      </div>

      {/* Due date and statute */}
      {(dueDate || statute) && (
        <div className="mt-4 text-sm text-muted-foreground space-y-1">
          {dueDate && (
            <p>Your due date was: {dueDate}</p>
          )}
          {statute && (
            <p>{statute}</p>
          )}
        </div>
      )}

      {/* Warning banners (children) */}
      {children && (
        <div className="mt-4 space-y-3">
          {children}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          This is an estimate based on the information provided. Actual penalties may differ.
          This tool does not constitute legal or tax advice. Consult a qualified CA or legal
          professional for your specific situation.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        {showCta && total > 0 && (
          <Button className="w-full" asChild>
            <Link href={`${ctaHref}?utm_source=tools&utm_medium=penalty_calc`}>
              {ctaText}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full print-hidden"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </Card>
  )
}
