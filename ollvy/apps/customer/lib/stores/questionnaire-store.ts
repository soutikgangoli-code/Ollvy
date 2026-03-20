import { create } from 'zustand'
import { getClient } from '../supabase'
import type {
  ServiceQuestion,
  QuestionnaireStep,
  QuestionnaireFormValues,
} from '../questionnaire/types'
import { STEP_TITLES, DEFAULT_STEP_TITLES } from '../questionnaire/types'

interface QuestionnaireState {
  // Data
  orderId: string | null
  serviceSlug: string | null
  serviceName: string | null
  questions: ServiceQuestion[]
  steps: QuestionnaireStep[]
  responses: QuestionnaireFormValues

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
  serviceSlug: null,
  serviceName: null,
  questions: [],
  steps: [],
  responses: {},
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

        // Explicitly set the session to ensure auth headers are included
        await supabase.auth.setSession({
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token,
        })

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

        // Fetch questions for this service
        const { data: questionsData, error: questionsError } = await supabase
          .from('service_questionnaires')
          .select('*')
          .eq('service_package_id', servicePackage.id)
          .eq('is_active', true)
          .order('step_number', { ascending: true })
          .order('display_order', { ascending: true })

        if (questionsError) throw questionsError

        // Fetch existing responses
        const { data: responsesData } = await supabase
          .from('order_questionnaire_responses')
          .select('question_key, response_value')
          .eq('order_id', orderId)

        // Build responses object
        const responses: QuestionnaireFormValues = {}
        if (responsesData) {
          for (const r of responsesData) {
            responses[r.question_key] = r.response_value as string | number | string[]
          }
        }

        // Group questions by step
        const stepMap = new Map<number, ServiceQuestion[]>()
        for (const q of questionsData || []) {
          const stepNum = q.step_number
          if (!stepMap.has(stepNum)) {
            stepMap.set(stepNum, [])
          }
          stepMap.get(stepNum)!.push(q as ServiceQuestion)
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

        // Determine current step - find first step with unanswered questions
        // A step is "incomplete" if it has any required question without a response
        // or any question without a response (for better UX, start where user left off)
        let currentStep = 1
        for (const step of steps) {
          const hasUnansweredQuestions = step.questions.some(q => {
            const response = responses[q.question_key]
            // Check if this question has no meaningful response
            if (response === undefined || response === null || response === '') {
              return true
            }
            // For arrays (multiselect), check if empty
            if (Array.isArray(response) && response.length === 0) {
              return true
            }
            return false
          })

          if (hasUnansweredQuestions) {
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
          currentStep,
          totalSteps: steps.length,
        })
      } catch (error) {
        console.error('Failed to load questionnaire:', error)
        set({
          isLoading: false,
          error: 'Failed to load questionnaire',
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
      const { orderId, currentStep, responses } = get()
      if (!orderId) return false

      set({ isSaving: true, error: null })

      try {
        const supabase = getClient()

        // Merge with existing responses
        const newResponses = { ...responses, ...stepResponses }
        set({ responses: newResponses })

        // Upsert each response
        const upsertPromises = Object.entries(stepResponses).map(([key, value]) => {
          if (value === undefined || value === '') return Promise.resolve()

          return supabase
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
        })

        await Promise.all(upsertPromises)

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
