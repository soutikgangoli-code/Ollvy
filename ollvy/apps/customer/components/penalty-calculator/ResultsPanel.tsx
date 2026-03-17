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
  onShare?: () => void
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

export function ResultsPanel({
  total,
  breakdown,
  dueDate,
  statute,
  ctaText = 'File Now',
  ctaHref = '/services',
  showCta = true,
  onShare,
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

  const handleShare = () => {
    if (onShare) {
      onShare()
      return
    }
    // Default WhatsApp share
    const message = `I checked my penalty on Ollvy: I owe ${formatCurrency(total)} in penalties. Check yours: ${window.location.href}`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload()
      return
    }
    // Default: print to PDF
    window.print()
  }

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
        <p className="text-4xl font-bold text-emerald-700">
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
        <span className="text-lg font-mono text-emerald-700">{formatCurrency(total)}</span>
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
            onClick={handleShare}
          >
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share on WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 print-hidden"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </Card>
  )
}
