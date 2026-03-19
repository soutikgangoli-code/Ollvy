// Questionnaire Types

export type QuestionType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'date'
  | 'file'

export interface QuestionOption {
  value: string
  label: string
}

export interface QuestionValidation {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  minItems?: number
  maxItems?: number
  pattern?: string
}

export interface QuestionDependency {
  question_key: string
  value?: string
  values?: string[]
}

export interface ServiceQuestion {
  id: string
  service_package_id: string
  question_key: string
  question_label: string
  question_type: QuestionType
  options?: QuestionOption[]
  validation?: QuestionValidation
  placeholder?: string
  help_text?: string
  depends_on?: QuestionDependency
  step_number: number
  display_order: number
  is_active: boolean
}

export interface QuestionnaireResponse {
  id: string
  order_id: string
  question_key: string
  response_value: string | number | string[] | Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface QuestionnaireStep {
  stepNumber: number
  title: string
  description?: string
  questions: ServiceQuestion[]
}

export interface QuestionnaireData {
  orderId: string
  serviceSlug: string
  serviceName: string
  steps: QuestionnaireStep[]
  totalSteps: number
  currentStep: number
  responses: Record<string, unknown>
  isCompleted: boolean
}

// Form values type for react-hook-form
export type QuestionnaireFormValues = Record<string, string | number | string[] | undefined>

// Step titles by service slug
export const STEP_TITLES: Record<string, Record<number, { title: string; description: string }>> = {
  'gst-registration': {
    1: {
      title: 'Business Type',
      description: 'Tell us about your business structure',
    },
    2: {
      title: 'Business Address',
      description: 'Where is your business located?',
    },
    3: {
      title: 'Business Activity',
      description: 'What does your business do?',
    },
  },
}

// Default step titles for services without custom titles
export const DEFAULT_STEP_TITLES: Record<number, { title: string; description: string }> = {
  1: { title: 'Basic Information', description: 'Tell us about your business' },
  2: { title: 'Details', description: 'Additional information needed' },
  3: { title: 'Review', description: 'Review and confirm your information' },
}
