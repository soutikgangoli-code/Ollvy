'use client'

import { useEffect, useMemo } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestionnaireProgress } from './QuestionnaireProgress'
import { QuestionField } from './QuestionField'
import { useQuestionnaireStore } from '@/lib/stores/questionnaire-store'
import { createStepSchema } from '@/lib/questionnaire/schemas'
import type { QuestionnaireFormValues } from '@/lib/questionnaire/types'
import { shouldShowQuestion } from '@/lib/questionnaire/types'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionnaireWizardProps {
  orderId: string
}

export function QuestionnaireWizard({ orderId }: QuestionnaireWizardProps) {
  const router = useRouter()
  const {
    steps,
    currentStep,
    totalSteps,
    responses,
    isLoading,
    isSaving,
    isCompleted,
    error,
    loadQuestionnaire,
    nextStep,
    prevStep,
    saveStepResponses,
    completeQuestionnaire,
    enableEditMode,
  } = useQuestionnaireStore()

  // Load questionnaire on mount
  useEffect(() => {
    loadQuestionnaire(orderId)
  }, [orderId, loadQuestionnaire])

  // Get current step data
  const currentStepData = useMemo(() => {
    return steps.find((s) => s.stepNumber === currentStep)
  }, [steps, currentStep])

  // Create dynamic schema for current step
  const stepSchema = useMemo(() => {
    if (!currentStepData) return null
    return createStepSchema(currentStepData.questions)
  }, [currentStepData])

  // Initialize form with current step's schema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methods = useForm<QuestionnaireFormValues>({
    resolver: stepSchema ? (zodResolver(stepSchema) as any) : undefined,
    defaultValues: responses,
    mode: 'onBlur',
  })

  // Reset form values when step changes or responses load
  useEffect(() => {
    if (currentStepData) {
      const stepDefaults: QuestionnaireFormValues = {}
      for (const q of currentStepData.questions) {
        stepDefaults[q.question_key] = responses[q.question_key] ?? (q.question_type === 'multiselect' ? [] : '')
      }
      methods.reset(stepDefaults)
    }
  }, [currentStep, currentStepData, responses, methods])

  // Watch all form values to handle conditional questions
  const watchedValues = useWatch({ control: methods.control })

  // Combine watched values with saved responses for dependency checks
  const allResponses = useMemo(() => ({
    ...responses,
    ...watchedValues,
  }), [responses, watchedValues])

  // Filter questions based on depends_on conditions
  const visibleQuestions = useMemo(() => {
    if (!currentStepData) return []
    return currentStepData.questions.filter((q) =>
      shouldShowQuestion(q, allResponses)
    )
  }, [currentStepData, allResponses])

  // Handle form submission for current step
  const onSubmit = async (data: QuestionnaireFormValues) => {
    const isLastStep = currentStep === totalSteps

    // Save step responses
    const saved = await saveStepResponses(data)
    if (!saved) return

    if (isLastStep) {
      // Complete questionnaire and redirect
      const completed = await completeQuestionnaire()
      if (completed) {
        router.push(`/orders/${orderId}/documents`)
      }
    } else {
      // Go to next step
      nextStep()
    }
  }

  const handleBack = () => {
    prevStep()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="h-1.5 w-full" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => loadQuestionnaire(orderId)}>
          Try Again
        </Button>
      </div>
    )
  }

  // Already completed
  if (isCompleted) {
    return (
      <div className="rounded-xl border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-[hsl(var(--ollvy-green))]" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Already Submitted
        </h2>
        <p className="text-muted-foreground mb-6">
          You've already completed the setup for this order.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={enableEditMode}>
            Edit Answers
          </Button>
          <Button onClick={() => router.push(`/orders/${orderId}/documents`)}>
            Continue to Documents
          </Button>
        </div>
      </div>
    )
  }

  // No questions configured
  if (steps.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-4">
          No setup questions required for this service.
        </p>
        <Button onClick={() => router.push(`/orders/${orderId}/documents`)}>
          Continue to Documents
        </Button>
      </div>
    )
  }

  const isLastStep = currentStep === totalSteps

  return (
    <div className="space-y-6">
      {/* Progress */}
      <QuestionnaireProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepTitle={currentStepData?.title}
      />

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div
            key={currentStep}
            className="animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              {/* Step Header */}
              {currentStepData?.description && (
                <p className="text-muted-foreground text-sm">
                  {currentStepData.description}
                </p>
              )}

              {/* Questions */}
              <div className="space-y-6">
                {visibleQuestions.map((question) => (
                  <QuestionField key={question.id} question={question} />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isSaving}
                  className={cn('gap-2', currentStep === 1 && 'invisible')}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>

                <Button type="submit" disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isLastStep ? (
                    <>
                      Complete
                      <CheckCircle className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
