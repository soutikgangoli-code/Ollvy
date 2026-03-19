'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { X, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EngagementLetterCardProps {
  serviceName: string
  scopeExcluded: string[]
  isAgreed: boolean
  onAgreementChange: (agreed: boolean) => void
}

export function EngagementLetterCard({
  serviceName,
  scopeExcluded,
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
          {scopeExcluded.length > 0 && (
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
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Review and agree to the scope of work
        </p>
      </CardHeader>

      <CardContent className="space-y-5 pt-0">
        {/* Scope Excluded - Only show if there are exclusions */}
        {scopeExcluded.length > 0 && isExpanded && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                <X className="h-3 w-3 text-muted-foreground" />
              </div>
              Not Included in This Service
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
            I have read and agree to the scope of work for {serviceName}. I understand what is
            included and excluded from this service.
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
