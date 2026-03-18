'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Download, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  children?: React.ReactNode
  maxPenalty?: number
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getPenaltyColor(amount: number, maxPenalty?: number): { text: string; bg: string } {
  if (amount === 0) return { text: 'text-muted-foreground', bg: 'bg-transparent' }

  if (maxPenalty && maxPenalty > 0) {
    const percentage = (amount / maxPenalty) * 100
    if (percentage < 25) return { text: 'text-amber-500', bg: 'bg-amber-500/5' }
    if (percentage < 60) return { text: 'text-orange-500', bg: 'bg-orange-500/5' }
    return { text: 'text-red-500', bg: 'bg-red-500/5' }
  }

  if (amount < 5000) return { text: 'text-amber-500', bg: 'bg-amber-500/5' }
  if (amount < 25000) return { text: 'text-orange-500', bg: 'bg-orange-500/5' }
  return { text: 'text-red-500', bg: 'bg-red-500/5' }
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
  maxPenalty,
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
    window.print()
  }

  const penaltyStyle = getPenaltyColor(total, maxPenalty)

  return (
    <div className={cn(
      'rounded-lg border border-border/50 overflow-hidden transition-colors duration-300',
      penaltyStyle.bg,
      className
    )}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Total Penalty
          </span>
          <span className="text-[10px] text-muted-foreground">
            {todayDate}
          </span>
        </div>
        <p className={cn('text-4xl font-mono font-semibold tracking-tight', penaltyStyle.text)}>
          {formatCurrency(total)}
        </p>
      </div>

      {/* Breakdown */}
      <div className="px-6 py-4 border-t border-border/30">
        <div className="space-y-3">
          {breakdown.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-foreground truncate">
                    {item.label}
                  </span>
                  {item.statuteShort && item.statuteFull && (
                    <StatutoryRef
                      shortText={item.statuteShort}
                      fullText={item.statuteFull}
                    />
                  )}
                </div>
                <span className="text-sm font-mono font-medium text-foreground shrink-0">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              {item.subItems && item.subItems.length > 0 && (
                <div className="ml-3 pl-3 border-l border-border/30 space-y-1">
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
      </div>

      {/* Total */}
      <div className="px-6 py-4 border-t border-border/30 bg-muted/30">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">Total</span>
          <span className={cn('text-lg font-mono font-semibold', penaltyStyle.text)}>
            {formatCurrency(total)}
          </span>
        </div>

        {(dueDate || statute) && (
          <div className="mt-3 space-y-0.5">
            {dueDate && (
              <p className="text-xs text-muted-foreground">Due: {dueDate}</p>
            )}
            {statute && (
              <p className="text-xs text-muted-foreground font-mono">{statute}</p>
            )}
          </div>
        )}
      </div>

      {/* Warnings / Info banners */}
      {children && (
        <div className="px-6 py-4 border-t border-border/30 space-y-3">
          {children}
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-4 border-t border-border/30 space-y-2">
        {showCta && total > 0 && (
          <Button className="w-full h-12" asChild>
            <Link href={`${ctaHref}?utm_source=tools&utm_medium=penalty_calc`}>
              {ctaText}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-3 bg-muted/20 border-t border-border/30">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Estimate only. Actual penalties may vary. Consult a qualified professional.
        </p>
      </div>
    </div>
  )
}
