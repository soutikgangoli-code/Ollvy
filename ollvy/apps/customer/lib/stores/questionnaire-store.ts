import { create } from 'zustand'
import { getClient } from '../supabase'
import { getPreCursorAnswers } from '../pre-cursor'
import type {
  ServiceQuestion,
  QuestionnaireStep,
  QuestionnaireFormValues,
} from '../questionnaire/types'
import { STEP_TITLES, DEFAULT_STEP_TITLES } from '../questionnaire/types'

type QuestionnaireMode = 'pre_payment' | 'post_payment'

interface QuestionnaireState {
  // Data
  orderId: string | null
  serviceId: string | null
  serviceSlug: string | null
  serviceName: string | null
  questions: ServiceQuestion[]
  steps: QuestionnaireStep[]
  responses: QuestionnaireFormValues
  prePaymentResponses: QuestionnaireFormValues  // Pre-cursor answers (for display in post_payment mode)
  prePaymentQuestions: ServiceQuestion[]  // Pre-cursor questions (for labels in summary card)
  mode: QuestionnaireMode

  // UI state
  currentStep: number
  totalSteps: number
  isLoading: boolean
  isSaving: boolean
  isCompleted: boolean
  error: string | null
}

interface QuestionnaireActions {
  // Initialize
  loadQuestionnaire: (orderId: string, forceEdit?: boolean) => Promise<void>
  loadPrePaymentQuestionnaire: (serviceId: string, serviceSlug: string, loadExisting?: boolean) => Promise<void>

  // Navigation
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  // Data
  setResponses: (responses: QuestionnaireFormValues) => void
  updateResponse: (key: string, value: unknown) => void
  saveStepResponses: (stepResponses: QuestionnaireFormValues) => Promise<boolean>
  completeQuestionnaire: () => Promise<boolean>

  // Edit mode
  enableEditMode: () => Promise<void>

  // Reset
  reset: () => void
}

const initialState: QuestionnaireState = {
  orderId: null,
  serviceId: null,
  serviceSlug: null,
  serviceName: null,
  questions: [],
  steps: [],
  responses: {},
  prePaymentResponses: {},
  prePaymentQuestions: [],
  mode: 'post_payment',
  currentStep: 1,
  totalSteps: 0,
  isLoading: false,
  isSaving: false,
  isCompleted: false,
  error: null,
}

export const useQuestionnaireStore = create<QuestionnaireState & QuestionnaireActions>(
  (set, get) => ({
    ...initialState,

    loadQuestionnaire: async (orderId: string, forceEdit: boolean = false) => {
      set({ isLoading: true, error: null, orderId })

      try {
        const supabase = getClient()

        // Get current session first
        const { data: { session: currentSession } } = await supabase.auth.getSession()

        if (!currentSession) {
          throw new Error('Not authenticated')
        }

        // Use RPC function for reliable order fetching (bypasses RLS chain issues)
        const { data: orderData, error: orderError } = await supabase
          .rpc('get_user_order', { p_order_id: orderId })

        if (orderError) throw orderError

        // RPC returns null if order doesn't exist or user doesn't own it
        if (!orderData) {
          throw new Error('Order not found')
        }

        const servicePackage = orderData.service_package as {
          id: string
          slug: string
          name: string
        }

        // If questionnaire already completed and not forcing edit mode, show completed state
        if (orderData.questionnaire_completed_at && !forceEdit) {
          set({
            isLoading: false,
            isCompleted: true,
            serviceSlug: servicePackage.slug,
            serviceName: servicePackage.name,
          })
          return
        }

        // Fetch all data in PARALLEL for better performance
        const [questionsResult, prePaymentQuestionsResult, responsesResult, userResult] = await Promise.all([
          // Post-payment questions
          supabase
            .from('service_questionnaires')
            .select('*')
            .eq('service_package_id', servicePackage.id)
            .eq('is_active', true)
            .eq('is_pre_payment', false)
            .order('step_number', { ascending: true })
            .order('display_order', { ascending: true }),
          // Pre-payment questions (for summary card)
          supabase
            .from('service_questionnaires')
            .select('*')
            .eq('service_package_id', servicePackage.id)
            .eq('is_active', true)
            .eq('is_pre_payment', true)
            .order('display_order', { ascending: true }),
          // Existing responses
          supabase
            .from('order_questionnaire_responses')
            .select('question_key, response_value')
            .eq('order_id', orderId),
          // User's phone number
          supabase
            .from('users')
            .select('phone')
            .eq('auth_user_id', currentSession.user.id)
            .single()
        ])

        const questionsData = questionsResult.data
        const questionsError = questionsResult.error
        if (questionsError) throw questionsError

        const prePaymentQuestionsData = prePaymentQuestionsResult.data
        const prePaymentQuestionKeys = new Set(
          (prePaymentQuestionsData || []).map(q => q.question_key)
        )

        const responsesData = responsesResult.data
        const userData = userResult.data

        // Build responses object and separate pre-payment responses
        const responses: QuestionnaireFormValues = {}
        const prePaymentResponses: QuestionnaireFormValues = {}
        if (responsesData) {
          for (const r of responsesData) {
            const value = r.response_value as string | number | string[]
            if (prePaymentQuestionKeys.has(r.question_key)) {
              prePaymentResponses[r.question_key] = value
            } else {
              responses[r.question_key] = value
            }
          }
        }

        // If user already has phone, skip the phone question entirely
        // (phone is captured from Razorpay payment or previous orders)
        let filteredQuestions = questionsData || []
        if (userData?.phone) {
          filteredQuestions = filteredQuestions.filter(q => q.question_key !== 'user_phone_number')
        } else if (!responses['user_phone_number']) {
          // Pre-fill phone number if user has one but we didn't filter
          // (This case shouldn't happen now, but keeping for safety)
          if (userData?.phone) {
            responses['user_phone_number'] = userData.phone
          }
        }

        // Group questions by step
        const stepMap = new Map<number, ServiceQuestion[]>()
        for (const q of filteredQuestions) {
          const stepNum = q.step_number
          if (!stepMap.has(stepNum)) {
            stepMap.set(stepNum, [])
          }
          const stepQuestions = stepMap.get(stepNum)
          if (stepQuestions) {
            stepQuestions.push(q as ServiceQuestion)
          }
        }

        // Build steps array with titles
        const stepTitles = STEP_TITLES[servicePackage.slug] || DEFAULT_STEP_TITLES
        const steps: QuestionnaireStep[] = []
        for (const [stepNum, questions] of stepMap) {
          const titleConfig = stepTitles[stepNum] || DEFAULT_STEP_TITLES[stepNum] || {
            title: `Step ${stepNum}`,
            description: '',
          }
          steps.push({
            stepNumber: stepNum,
            title: titleConfig.title,
            description: titleConfig.description,
            questions,
          })
        }

        // Sort steps by step number
        steps.sort((a, b) => a.stepNumber - b.stepNumber)

        // Determine current step - find first step with unanswered REQUIRED questions
        // Only mark step as incomplete if a REQUIRED question has no response
        let currentStep = 1
        for (const step of steps) {
          const hasUnansweredRequiredQuestions = step.questions.some(q => {
            // Only check required questions
            if (!q.validation?.required) {
              return false
            }

            const response = responses[q.question_key]
            // Check if this required question has no meaningful response
            if (response === undefined || response === null || response === '') {
              return true
            }
            // For arrays (multiselect), check if empty
            if (Array.isArray(response) && response.length === 0) {
              return true
            }
            return false
          })

          if (hasUnansweredRequiredQuestions) {
            currentStep = step.stepNumber
            break
          }
        }

        // If all steps have answers, start from step 1 for review
        if (currentStep === 1 && steps.length > 0) {
          // Double-check: if first step is fully answered, user might want to review
          // Keep at step 1 for now - they can navigate
        }

        set({
          isLoading: false,
          serviceSlug: servicePackage.slug,
          serviceName: servicePackage.name,
          questions: questionsData as ServiceQuestion[],
          steps,
          responses,
          prePaymentResponses,
          prePaymentQuestions: (prePaymentQuestionsData || []) as ServiceQuestion[],
          currentStep,
          totalSteps: steps.length,
          mode: 'post_payment',
        })
      } catch (error) {
        console.error('Failed to load questionnaire:', error)
        set({
          isLoading: false,
          error: 'Failed to load questionnaire',
        })
      }
    },

    loadPrePaymentQuestionnaire: async (serviceId: string, serviceSlug: string, loadExisting: boolean = false) => {
      // Reset store to clear any cached data from previous loads
      set({ ...initialState, isLoading: true, error: null, serviceId, serviceSlug, mode: 'pre_payment' })

      try {
        const supabase = getClient()

        // Fetch service package details
        const { data: servicePackage, error: serviceError } = await supabase
          .from('service_packages')
          .select('id, slug, name')
          .eq('id', serviceId)
          .single()

        if (serviceError) throw serviceError

        // Fetch only pre-payment questions for this service
        const { data: questionsData, error: questionsError } = await supabase
          .from('service_questionnaires')
          .select('*')
          .eq('service_package_id', serviceId)
          .eq('is_active', true)
          .eq('is_pre_payment', true)
          .order('step_number', { ascending: true })
          .order('display_order', { ascending: true })

        if (questionsError) throw questionsError

        // Load existing responses from sessionStorage only when editing
        let responses: QuestionnaireFormValues = {}
        if (loadExisting) {
          const existingAnswers = getPreCursorAnswers(serviceSlug)
          if (existingAnswers) {
            responses = Object.fromEntries(
              Object.entries(existingAnswers).map(([k, v]) => [k, v as string | number | string[]])
            )
          }
        }

        // Group questions by step
        const stepMap = new Map<number, ServiceQuestion[]>()
        for (const q of questionsData || []) {
          const stepNum = q.step_number
          if (!stepMap.has(stepNum)) {
            stepMap.set(stepNum, [])
          }
          const stepQuestions = stepMap.get(stepNum)
          if (stepQuestions) {
            stepQuestions.push(q as ServiceQuestion)
          }
        }

        // Build steps array with titles
        const stepTitles = STEP_TITLES[serviceSlug] || DEFAULT_STEP_TITLES
        const steps: QuestionnaireStep[] = []
        for (const [stepNum, questions] of stepMap) {
          const titleConfig = stepTitles[stepNum] || DEFAULT_STEP_TITLES[stepNum] || {
            title: `Step ${stepNum}`,
            description: '',
          }
          steps.push({
            stepNumber: stepNum,
            title: titleConfig.title,
            description: titleConfig.description,
            questions,
          })
        }

        // Sort steps by step number
        steps.sort((a, b) => a.stepNumber - b.stepNumber)

        set({
          isLoading: false,
          serviceSlug: servicePackage.slug,
          serviceName: servicePackage.name,
          questions: questionsData as ServiceQuestion[],
          steps,
          responses,
          currentStep: 1,
          totalSteps: steps.length,
          mode: 'pre_payment',
        })
      } catch (error) {
        console.error('Failed to load pre-payment questionnaire:', error)
        set({
          isLoading: false,
          error: 'Failed to load eligibility questions',
        })
      }
    },

    goToStep: (step: number) => {
      const { totalSteps } = get()
      if (step >= 1 && step <= totalSteps) {
        set({ currentStep: step })
      }
    },

    nextStep: () => {
      const { currentStep, totalSteps } = get()
      if (currentStep < totalSteps) {
        set({ currentStep: currentStep + 1 })
      }
    },

    prevStep: () => {
      const { currentStep } = get()
      if (currentStep > 1) {
        set({ currentStep: currentStep - 1 })
      }
    },

    setResponses: (responses: QuestionnaireFormValues) => {
      set({ responses })
    },

    updateResponse: (key: string, value: unknown) => {
      const { responses } = get()
      set({
        responses: {
          ...responses,
          [key]: value as string | number | string[],
        },
      })
    },

    saveStepResponses: async (stepResponses: QuestionnaireFormValues) => {
      const { orderId, currentStep, responses, mode } = get()

      // Merge with existing responses
      const newResponses = { ...responses, ...stepResponses }
      set({ responses: newResponses })

      // In pre_payment mode, don't persist to database - just update local state
      if (mode === 'pre_payment') {
        return true
      }

      // Post-payment mode requires orderId
      if (!orderId) return false

      set({ isSaving: true, error: null })

      try {
        const supabase = getClient()

        // Special handling for phone number question - also update users table
        const phoneNumber = stepResponses['user_phone_number']
        if (phoneNumber && typeof phoneNumber === 'string') {
          // Get the current user
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            // Update the user's phone number in the users table
            const { error: phoneError } = await supabase
              .from('users')
              .update({ phone: phoneNumber })
              .eq('auth_user_id', session.user.id)

            if (phoneError) {
              console.error('Failed to update user phone:', phoneError)
              // Don't fail the whole save - continue with questionnaire responses
            }
          }
        }

        // Upsert each response - use allSettled to handle partial failures gracefully
        const upsertPromises = Object.entries(stepResponses)
          .filter(([, value]) => value !== undefined && value !== '')
          .map(async ([key, value]) => {
            try {
              const result = await supabase
                .from('order_questionnaire_responses')
                .upsert(
                  {
                    order_id: orderId,
                    question_key: key,
                    response_value: value,
                    updated_at: new Date().toISOString(),
                  },
                  {
                    onConflict: 'order_id,question_key',
                  }
                )
              return { key, status: 'fulfilled' as const, result }
            } catch (error) {
              return { key, status: 'rejected' as const, error }
            }
          })

        const results = await Promise.all(upsertPromises)
        const failures = results.filter(r => r.status === 'rejected')
        if (failures.length > 0) {
          console.error('Some responses failed to save:', failures)
          // Continue anyway - partial save is better than no save
        }

        // Update order's questionnaire_step
        await supabase
          .from('orders')
          .update({ questionnaire_step: currentStep })
          .eq('id', orderId)

        set({ isSaving: false })
        return true
      } catch (error) {
        console.error('Failed to save responses:', error)
        set({ isSaving: false, error: 'Failed to save responses' })
        return false
      }
    },

    completeQuestionnaire: async () => {
      const { orderId } = get()
      if (!orderId) return false

      set({ isSaving: true, error: null })

      try {
        const supabase = getClient()

        // Call the RPC function to mark complete
        const { error } = await supabase.rpc('complete_order_questionnaire', {
          p_order_id: orderId,
        })

        if (error) throw error

        set({ isSaving: false, isCompleted: true })
        return true
      } catch (error) {
        console.error('Failed to complete questionnaire:', error)
        set({ isSaving: false, error: 'Failed to complete questionnaire' })
        return false
      }
    },

    enableEditMode: async () => {
      const { orderId } = get()
      if (!orderId) return

      // Reset completed state and reload with forceEdit=true
      set({ isCompleted: false })
      await get().loadQuestionnaire(orderId, true)
    },

    reset: () => {
      set(initialState)
    },
  })
)
