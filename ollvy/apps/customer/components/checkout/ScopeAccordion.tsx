'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'

interface ScopeAccordionProps {
  serviceName: string
  price: string
  scopeIncluded: string[]
  scopeExcluded: string[]
  isAgreed: boolean
  onAgreementChange: (agreed: boolean) => void
  showError?: boolean
  className?: string
}

export function ScopeAccordion({
  serviceName,
  price,
  scopeIncluded,
  scopeExcluded,
  isAgreed,
  onAgreementChange,
  showError = false,
  className,
}: ScopeAccordionProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">SCOPE OF WORK</p>
        <h3 className="text-lg md:text-xl font-semibold text-foreground">What's included - and what isn't</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Read this before you pay. It takes 60 seconds.
        </p>
      </div>

      {/* Accordion Items */}
      <div className="border border-border rounded-xl divide-y divide-border">
        {/* Section 1: What's included */}
        <div>
          <button
            onClick={() => toggleSection('included')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
          >
            <span className="font-medium text-foreground">What's included in {price}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                openSections.included && 'rotate-180'
              )}
            />
          </button>
          {openSections.included && (
            <div className="px-4 pb-4">
              <div className="grid sm:grid-cols-2 gap-2">
                {scopeIncluded.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-[hsl(var(--ollvy-green))] mt-0.5">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: What's not included */}
        <div>
          <button
            onClick={() => toggleSection('excluded')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
          >
            <span className="font-medium text-foreground">What's not included</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                openSections.excluded && 'rotate-180'
              )}
            />
          </button>
          {openSections.excluded && (
            <div className="px-4 pb-4">
              <ul className="space-y-1.5">
                {scopeExcluded.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section 3: Refund & timeline commitment */}
        <div>
          <button
            onClick={() => toggleSection('refund')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
          >
            <span className="font-medium text-foreground">Refund & timeline commitment</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                openSections.refund && 'rotate-180'
              )}
            />
          </button>
          {openSections.refund && (
            <div className="px-4 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Full refund within 2 hours of payment if you change your mind - no questions asked.
                After documents are submitted to MCA, refund is not possible as government fees are
                non-refundable by law. Ollvy commits to filing within 7 working days of receiving
                complete documents from you.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Agreement checkbox */}
      <div className="space-y-2">
        <div
          className={cn(
            'flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors',
            isAgreed
              ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
              : 'border-border hover:border-[hsl(var(--ollvy-green))]/30'
          )}
          onClick={() => onAgreementChange(!isAgreed)}
        >
          <Checkbox
            id="scope-agreement"
            checked={isAgreed}
            onCheckedChange={(checked) => onAgreementChange(checked === true)}
            className="mt-0.5"
          />
          <label
            htmlFor="scope-agreement"
            className="text-sm text-foreground cursor-pointer leading-relaxed"
          >
            I have read and understand the scope of work above
          </label>
        </div>
        {showError && !isAgreed && (
          <p className="text-sm text-destructive">
            Please confirm you've reviewed the scope of work.
          </p>
        )}
      </div>
    </div>
  )
}
