'use client'

import { useEffect, useMemo, useState } from 'react'
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
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, Sparkles, Info, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { checkAndFireSubmissionEmail } from '@/app/(main)/orders/[id]/actions'

interface QuestionnaireWizardProps {
  orderId?: string                    // optional - not available in pre_payment mode
  serviceId?: string                  // required in pre_payment mode
  serviceSlug?: string                // required in pre_payment mode
  forceEdit?: boolean
  mode?: 'pre_payment' | 'post_payment'  // default: 'post_payment'
  loadExisting?: boolean              // load existing answers from sessionStorage (for editing)
  onComplete?: (answers: Record<string, unknown>) => void  // required in pre_payment mode
  onValuesChange?: (values: Record<string, unknown>) => void  // real-time value updates for live pricing
  locked?: boolean                    // setup approved by admin — answers are read-only
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
  locked = false,
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
    hasInitialized,
    error,
    loadQuestionnaire,
    loadPrePaymentQuestionnaire,
    nextStep,
    prevStep,
    saveStepResponses,
    completeQuestionnaire,
    enableEditMode,
  } = useQuestionnaireStore()

  // While we complete the questionnaire and navigate to documents, show the
  // transition (loading) state instead of letting the "all done" success screen
  // flash for a moment before the route changes.
  const [isNavigating, setIsNavigating] = useState(false)

  // Load questionnaire on mount
  useEffect(() => {
    if (mode === 'pre_payment' && serviceId && serviceSlug) {
      loadPrePaymentQuestionnaire(serviceId, serviceSlug, loadExisting)
    } else if (orderId) {
      loadQuestionnaire(orderId, forceEdit)
    }
  }, [orderId, serviceId, serviceSlug, mode, forceEdit, loadExisting, loadQuestionnaire, loadPrePaymentQuestionnaire])

  // Handle case where there are no pre-payment questions (redirect to checkout)
  // Only trigger after data has loaded (serviceName is set) AND store has initialized
  // The hasInitialized guard prevents redirect during the reset window before questions load
  useEffect(() => {
    if (!isLoading && hasInitialized && mode === 'pre_payment' && serviceName && steps.length === 0) {
      onComplete?.({})
    }
  }, [isLoading, hasInitialized, mode, serviceName, steps.length, onComplete])

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

  // Scroll to top on every step change (Next/Skip/Back/jump)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

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

  // Calculate completion stats for post_payment mode
  const completionStats = useMemo(() => {
    if (mode !== 'post_payment' || steps.length === 0) {
      return { totalQuestions: 0, answeredQuestions: 0, firstIncompleteStep: 1 }
    }

    let totalQuestions = 0
    let answeredQuestions = 0
    let firstIncompleteStep = 1
    let foundIncomplete = false

    for (const step of steps) {
      for (const q of step.questions) {
        // Only count visible questions (check depends_on)
        if (!shouldShowQuestion(q, responses)) continue

        totalQuestions++
        const answer = responses[q.question_key]
        const hasAnswer = answer !== undefined && answer !== null && answer !== '' &&
          !(Array.isArray(answer) && answer.length === 0)

        if (hasAnswer) {
          answeredQuestions++
        } else if (!foundIncomplete) {
          firstIncompleteStep = step.stepNumber
          foundIncomplete = true
        }
      }
    }

    return { totalQuestions, answeredQuestions, firstIncompleteStep }
  }, [mode, steps, responses])

  // Check if current step has all visible questions answered
  const isCurrentStepComplete = useMemo(() => {
    if (!visibleQuestions.length) return true

    // Combine saved responses with current form values
    const currentFormValues = methods.getValues()
    const combinedResponses = { ...responses, ...currentFormValues }

    return visibleQuestions.every((q) => {
      const answer = combinedResponses[q.question_key]
      return answer !== undefined && answer !== null && answer !== '' &&
        !(Array.isArray(answer) && answer.length === 0)
    })
  }, [visibleQuestions, responses, methods])

  // Handle form submission for current step
  const onSubmit = async (data: QuestionnaireFormValues) => {
    // Setup approved by admin — answers are locked, ignore any save attempt.
    if (locked) return
    const isLastStep = currentStep === totalSteps

    // Save step responses
    const saved = await saveStepResponses(data)
    if (!saved) return

    if (isLastStep) {
      if (mode === 'pre_payment') {
        // Flip to the transition (loading) state first so the form doesn't flash
        // or the button revert from "Processing..." during the router.push hand-off
        // to /checkout. onComplete always navigates away, so this never strands.
        setIsNavigating(true)
        // In pre_payment mode, call onComplete with all answers
        // Get fresh responses from store (includes all saved steps including current)
        const freshResponses = useQuestionnaireStore.getState().responses
        onComplete?.(freshResponses)
      } else {
        // Complete questionnaire and redirect. Flip to the transition state first
        // so the "all done" success screen never flashes before navigation.
        setIsNavigating(true)
        const completed = await completeQuestionnaire()
        if (completed && orderId) {
          // Idempotent server-side and a no-op until documents are also done, so
          // fire-and-forget — don't block navigation on a cross-region round-trip.
          void checkAndFireSubmissionEmail(orderId)
          router.push(`/orders/${orderId}/documents`)
        } else {
          setIsNavigating(false)
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
  if (isLoading || isWaitingForData || isNavigating) {
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

  // Already completed - check if all questions are answered
  if (isCompleted) {
    const { totalQuestions, answeredQuestions, firstIncompleteStep } = completionStats

    // If there are no questions configured for this service, show "No Questionnaire Required"
    // instead of "All Done" (which would be misleading)
    if (totalQuestions === 0 && steps.length === 0) {
      return (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No Questionnaire Required
          </h2>
          <p className="text-muted-foreground mb-6">
            This service does not require a questionnaire. Continue to upload your documents.
          </p>
          <Button onClick={() => router.push(`/orders/${orderId}/documents`)}>
            Continue to Documents
          </Button>
        </div>
      )
    }

    const hasIncompleteAnswers = answeredQuestions < totalQuestions
    const incompleteCount = totalQuestions - answeredQuestions

    // Handle edit mode with navigation to first incomplete step
    const handleEditAnswers = async () => {
      await enableEditMode()
      // Navigate to first incomplete step if there are incomplete answers
      if (hasIncompleteAnswers) {
        const store = useQuestionnaireStore.getState()
        store.goToStep(firstIncompleteStep)
      }
    }

    if (hasIncompleteAnswers) {
      // Show incomplete state with amber/warning styling
      return (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {incompleteCount} {incompleteCount === 1 ? 'Question' : 'Questions'} Remaining
          </h2>
          <p className="text-muted-foreground mb-6">
            Complete the remaining questions to help us process your order faster.
          </p>
          {locked && (
            <p className="text-xs text-muted-foreground mb-4">Approved by Ollvy — your answers are locked.</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!locked && (
              <Button onClick={handleEditAnswers}>
                Complete Now
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push(`/orders/${orderId}/documents`)}>
              Continue to Documents
            </Button>
          </div>
        </div>
      )
    }

    // All questions answered - show green success state
    return (
      <div className="rounded-xl border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-[hsl(var(--ollvy-green))]" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          All Done
        </h2>
        <p className="text-muted-foreground mb-6">
          You've completed all the questions for this order.
        </p>
        {locked && (
          <p className="text-xs text-muted-foreground mb-4">Approved by Ollvy — your answers are locked.</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!locked && (
            <Button variant="outline" onClick={handleEditAnswers}>
              Edit Answers
            </Button>
          )}
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
                      {/* In post_payment mode: Skip if empty, Next if filled */}
                      {mode === 'post_payment' && !isCurrentStepComplete ? 'Skip' : 'Next'}
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
