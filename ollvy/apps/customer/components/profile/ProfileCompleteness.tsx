'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check, Circle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileCompletenessProps {
  score: number
  missingFields: Array<{
    field: string
    label: string
    importance: 'required' | 'recommended'
  }>
}

export function ProfileCompleteness({
  score,
  missingFields,
}: ProfileCompletenessProps) {
  if (score >= 100) {
    return (
      <Card className="border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center">
              <Check className="h-5 w-5 text-[hsl(var(--ollvy-green))]" />
            </div>
            <div>
              <p className="font-medium text-foreground">Profile Complete</p>
              <p className="text-sm text-muted-foreground">All details filled in</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground">Complete Your Profile</p>
          <span className="font-mono text-sm text-muted-foreground">{score}%</span>
        </div>
        <Progress value={score} className="h-2 mb-3" />

        {missingFields.length > 0 && (
          <div className="space-y-2 mb-3">
            {missingFields.slice(0, 3).map((field) => (
              <div key={field.field} className="flex items-center gap-2 text-sm">
                <Circle className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{field.label}</span>
                {field.importance === 'required' && (
                  <span className="text-xs text-destructive">Required</span>
                )}
              </div>
            ))}
          </div>
        )}

        <Link href="/profile?setup=true">
          <Button variant="outline" size="sm" className="w-full gap-2">
            Complete Profile
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
