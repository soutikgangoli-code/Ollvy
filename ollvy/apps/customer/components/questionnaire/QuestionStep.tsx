'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QuestionField } from './QuestionField'
import type { QuestionnaireStep } from '@/lib/questionnaire/types'

interface QuestionStepProps {
  step: QuestionnaireStep
}

export function QuestionStep({ step }: QuestionStepProps) {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-semibold text-foreground">
          {step.title}
        </CardTitle>
        {step.description && (
          <p className="text-muted-foreground">
            {step.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        {step.questions.map((question) => (
          <QuestionField key={question.id} question={question} />
        ))}
      </CardContent>
    </Card>
  )
}
