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
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, Sparkles, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionnaireWizardProps {
  orderId?: string                    // optional - not available in pre_payment mode
  serviceId?: string                  // required in pre_payment mode
  serviceSlug?: string                // required in pre_payment mode
  forceEdit?: boolean
  mode?: 'pre_payment' | 'post_payment'  // default: 'post_payment'
  loadExisting?: boolean              // load existing answers from sessionStorage (for editing)
  onComplete?: (answers: Record<string, unknown>) => void  // required in pre_payment mode
  onValuesChange?: (values: Record<string, unknown>) => void  // real-time value updates for live pricing
}

export function QuestionnaireWizard({
  orderId,
  serviceId,
  serviceSlug,
  forceEdit = false,
  mode = 'post_payment',
  loadExisting = false,
  onComplete,
  onValuesChange,
}: QuestionnaireWizardProps) {
  const router = useRouter()
  const {
    steps,
    currentStep,
    totalSteps,
    responses,
    prePaymentResponses,
    prePaymentQuestions,
    serviceName,
    isLoading,
    isSaving,
    isCompleted,
    error,
    loadQuestionnaire,
    loadPrePaymentQuestionnaire,
    nextStep,
    prevStep,
    saveStepResponses,
    completeQuestionnaire,
    enableEditMode,
  } = useQuestionnaireStore()

  // Load questionnaire on mount
  useEffect(() => {
    if (mode === 'pre_payment' && serviceId && serviceSlug) {
      loadPrePaymentQuestionnaire(serviceId, serviceSlug, loadExisting)
    } else if (orderId) {
      loadQuestionnaire(orderId, forceEdit)
    }
  }, [orderId, serviceId, serviceSlug, mode, forceEdit, loadExisting, loadQuestionnaire, loadPrePaymentQuestionnaire])

  // Handle case where there are no pre-payment questions (redirect to checkout)
  // Only trigger after data has loaded (serviceName is set)
  useEffect(() => {
    if (!isLoading && mode === 'pre_payment' && serviceName && steps.length === 0) {
      onComplete?.({})
    }
  }, [isLoading, mode, serviceName, steps.length, onComplete])

  // Get current step data
  const currentStepData = useMemo(() => {
    return steps.find((s) => s.stepNumber === currentStep)
  }, [steps, currentStep])

  // Create dynamic schema for current step
  // In post_payment mode, all fields are optional
  const stepSchema = useMemo(() => {
    if (!currentStepData) return null
    return createStepSchema(currentStepData.questions, mode)
  }, [currentStepData, mode])

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
      console.log('[QuestionnaireWizard] Resetting form for step', currentStep, 'with defaults:', stepDefaults, 'from responses:', responses)
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

  // Notify parent of value changes for live pricing
  useEffect(() => {
    if (onValuesChange && mode === 'pre_payment') {
      console.log('[QuestionnaireWizard] onValuesChange:', allResponses)
      onValuesChange(allResponses)
    }
  }, [allResponses, onValuesChange, mode])

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
      if (mode === 'pre_payment') {
        // In pre_payment mode, call onComplete with all answers
        // Get fresh responses from store (includes all saved steps including current)
        const freshResponses = useQuestionnaireStore.getState().responses
        onComplete?.(freshResponses)
      } else {
        // Complete questionnaire and redirect
        const completed = await completeQuestionnaire()
        if (completed && orderId) {
          router.push(`/orders/${orderId}/documents`)
        }
      }
    } else {
      // Go to next step
      nextStep()

      // Explicitly reset form with next step's data from fresh store state
      // (don't rely on useEffect timing)
      const { responses: freshResponses, steps: freshSteps, currentStep: newStep } = useQuestionnaireStore.getState()
      const nextStepData = freshSteps.find((s) => s.stepNumber === newStep)
      if (nextStepData) {
        const stepDefaults: QuestionnaireFormValues = {}
        for (const q of nextStepData.questions) {
          stepDefaults[q.question_key] = freshResponses[q.question_key] ?? (q.question_type === 'multiselect' ? [] : '')
        }
        methods.reset(stepDefaults)
      }
    }
  }

  const handleBack = async () => {
    // Save current step answers before going back (so they're preserved)
    const currentValues = methods.getValues()
    await saveStepResponses(currentValues)
    prevStep()

    // Explicitly reset form with previous step's data from fresh store state
    // (don't rely on useEffect timing)
    const { responses: freshResponses, steps: freshSteps, currentStep: newStep } = useQuestionnaireStore.getState()
    const prevStepData = freshSteps.find((s) => s.stepNumber === newStep)
    if (prevStepData) {
      const stepDefaults: QuestionnaireFormValues = {}
      for (const q of prevStepData.questions) {
        stepDefaults[q.question_key] = freshResponses[q.question_key] ?? (q.question_type === 'multiselect' ? [] : '')
      }
      methods.reset(stepDefaults)
    }
  }

  // Loading state - also show loading if we haven't loaded data yet in pre_payment mode
  const isWaitingForData = mode === 'pre_payment' && !serviceName && !error
  if (isLoading || isWaitingForData) {
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
        <Button onClick={() => {
          if (mode === 'pre_payment' && serviceId && serviceSlug) {
            loadPrePaymentQuestionnaire(serviceId, serviceSlug)
          } else if (orderId) {
            loadQuestionnaire(orderId)
          }
        }}>
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
    // In pre_payment mode with no questions, useEffect will handle redirect
    if (mode === 'pre_payment') {
      return null
    }

    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-4">
          No setup questions required for this service.
        </p>
        <Button onClick={() => orderId && router.push(`/orders/${orderId}/documents`)}>
          Continue to Documents
        </Button>
      </div>
    )
  }

  const isLastStep = currentStep === totalSteps

  // Check if we have pre-payment responses to display (in post_payment mode only)
  const hasPrePaymentAnswers = mode === 'post_payment' && Object.keys(prePaymentResponses).length > 0

  return (
    <div className="space-y-6">
      {/* Pre-payment answers summary (only in post_payment mode) */}
      {hasPrePaymentAnswers && (
        <div className="rounded-xl border border-border bg-muted/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              Your Selections
            </p>
          </div>
          <div className="space-y-3">
            {Object.entries(prePaymentResponses).map(([key, value]) => {
              // Find the question to get its label
              const question = prePaymentQuestions.find(q => q.question_key === key)
              const label = question?.question_label || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

              // Format the value for display
              let displayValue = String(value)
              if (question?.options && Array.isArray(question.options)) {
                const option = question.options.find((o: { value: string; label: string }) => o.value === value)
                if (option) displayValue = option.label
              }

              // Check if value is numeric
              const isNumeric = /^\d+$/.test(displayValue)

              return (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`text-foreground ${isNumeric ? 'font-mono font-semibold' : 'font-medium'}`}>
                    {displayValue}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
                  <QuestionField key={question.id} question={question} mode={mode} />
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
                      {mode === 'pre_payment' ? 'Processing...' : 'Saving...'}
                    </>
                  ) : isLastStep ? (
                    mode === 'pre_payment' ? (
                      <>
                        See My Price
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Complete
                        <CheckCircle className="h-4 w-4" />
                      </>
                    )
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
