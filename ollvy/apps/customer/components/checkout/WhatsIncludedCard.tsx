'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WhatsIncludedCardProps {
  items: string[]
  className?: string
}

const INITIAL_VISIBLE = 5

export function WhatsIncludedCard({ items, className }: WhatsIncludedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!items || items.length === 0) {
    return null
  }

  const shouldCollapse = items.length > INITIAL_VISIBLE
  const visibleItems = isExpanded ? items : items.slice(0, INITIAL_VISIBLE)
  const hiddenCount = items.length - INITIAL_VISIBLE

  return (
    <Card className={cn('border-border', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-base">
          <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center">
            <Check className="h-3 w-3 text-[hsl(var(--ollvy-green))]" />
          </div>
          What&apos;s Included
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          What Ollvy handles for you
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-3">
          {visibleItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-[hsl(var(--ollvy-green))] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>

        {shouldCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <>
                Show less
                <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Show {hiddenCount} more
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
