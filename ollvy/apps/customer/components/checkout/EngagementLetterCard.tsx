'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Check, X, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EngagementLetterCardProps {
  serviceName: string
  scopeIncluded: string[]
  scopeExcluded: string[]
  slaDays: number
  isAgreed: boolean
  onAgreementChange: (agreed: boolean) => void
}

export function EngagementLetterCard({
  serviceName,
  scopeIncluded,
  scopeExcluded,
  slaDays,
  isAgreed,
  onAgreementChange,
}: EngagementLetterCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-base">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Engagement Letter
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Review the scope of work for {serviceName}
        </p>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-5 pt-0">
          {/* Scope Included */}
          {scopeIncluded.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-[hsl(var(--ollvy-green))]" />
                </div>
                What&apos;s Included
              </h4>
              <ul className="space-y-2 pl-7">
                {scopeIncluded.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Check className="h-4 w-4 text-[hsl(var(--ollvy-green))] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Scope Excluded */}
          {scopeExcluded.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                  <X className="h-3 w-3 text-muted-foreground" />
                </div>
                Not Included
              </h4>
              <ul className="space-y-2 pl-7">
                {scopeExcluded.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <X className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SLA Guarantee */}
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm text-foreground">
              <strong>Guaranteed Completion:</strong> {slaDays} working days from document submission
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Subject to timely document submission and government processing times
            </p>
          </div>

          {/* Agreement Checkbox */}
          <div
            className={cn(
              'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all',
              isAgreed
                ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
                : 'border-border hover:border-border/80'
            )}
            onClick={() => onAgreementChange(!isAgreed)}
          >
            <Checkbox
              id="engagement-agree"
              checked={isAgreed}
              onCheckedChange={(checked) => onAgreementChange(checked === true)}
              className="mt-0.5"
            />
            <label
              htmlFor="engagement-agree"
              className="text-sm text-foreground cursor-pointer leading-relaxed"
            >
              I have read and agree to the scope of work outlined above. I understand what is included
              and excluded from this service.
            </label>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
