import { z } from 'zod'
import type { ServiceQuestion, QuestionValidation } from './types'

// Create a dynamic Zod schema from a question's validation rules
// If forceOptional is true, the field will be optional regardless of validation.required
// This is used for questions with depends_on that may be hidden
export function createQuestionSchema(question: ServiceQuestion, forceOptional: boolean = false): z.ZodTypeAny {
  const validation = question.validation || {}
  // If question has depends_on, make it optional in schema (validated at runtime based on visibility)
  const effectiveRequired = forceOptional ? false : !!validation.required

  switch (question.question_type) {
    case 'text':
      return createTextSchema(validation, effectiveRequired)

    case 'textarea':
      return createTextSchema(validation, effectiveRequired)

    case 'number':
      return createNumberSchema(validation, effectiveRequired)

    case 'select':
      return createSelectSchema(validation, question.options, effectiveRequired)

    case 'multiselect':
      return createMultiselectSchema(validation, question.options, effectiveRequired)

    case 'radio':
      return createSelectSchema(validation, question.options, effectiveRequired)

    case 'date':
      return createDateSchema(validation, effectiveRequired)

    case 'file':
      return createFileSchema(validation, effectiveRequired)

    default:
      return z.string().optional()
  }
}

function createTextSchema(validation: QuestionValidation, required: boolean): z.ZodTypeAny {
  let schema = z.string()

  if (validation.minLength) {
    schema = schema.min(validation.minLength, {
      message: `Must be at least ${validation.minLength} characters`,
    })
  }

  if (validation.maxLength) {
    schema = schema.max(validation.maxLength, {
      message: `Must be at most ${validation.maxLength} characters`,
    })
  }

  if (validation.pattern) {
    schema = schema.regex(new RegExp(validation.pattern), {
      message: 'Invalid format',
    })
  }

  if (required) {
    return schema.min(1, { message: 'This field is required' })
  }

  return schema.optional().or(z.literal(''))
}

function createNumberSchema(validation: QuestionValidation, required: boolean): z.ZodTypeAny {
  let schema = z.coerce.number()

  if (validation.min !== undefined) {
    schema = schema.min(validation.min, {
      message: `Must be at least ${validation.min}`,
    })
  }

  if (validation.max !== undefined) {
    schema = schema.max(validation.max, {
      message: `Must be at most ${validation.max}`,
    })
  }

  if (required) {
    return schema
  }

  return schema.optional()
}

function createSelectSchema(
  validation: QuestionValidation,
  options: { value: string; label: string }[] | undefined,
  required: boolean
): z.ZodTypeAny {
  if (options && options.length > 0) {
    const values = options.map((o) => o.value) as [string, ...string[]]
    const schema = z.enum(values, { message: 'Please choose an option' })

    if (required) {
      return schema
    }
    return schema.optional().or(z.literal(''))
  }

  const schema = z.string()
  if (required) {
    return schema.min(1, { message: 'Please choose an option' })
  }
  return schema.optional().or(z.literal(''))
}

function createMultiselectSchema(
  validation: QuestionValidation,
  _options: { value: string; label: string }[] | undefined,
  required: boolean
): z.ZodTypeAny {
  let schema = z.array(z.string())

  if (validation.minItems) {
    schema = schema.min(validation.minItems, {
      message: `Select at least ${validation.minItems} option${validation.minItems > 1 ? 's' : ''}`,
    })
  }

  if (validation.maxItems) {
    schema = schema.max(validation.maxItems, {
      message: `Select at most ${validation.maxItems} options`,
    })
  }

  if (required) {
    return schema.min(1, { message: 'Please select at least one option' })
  }

  return schema.optional().default([])
}

function createDateSchema(validation: QuestionValidation, required: boolean): z.ZodTypeAny {
  const schema = z.string()

  if (required) {
    return schema.min(1, { message: 'Please select a date' })
  }

  return schema.optional().or(z.literal(''))
}

function createFileSchema(validation: QuestionValidation, required: boolean): z.ZodTypeAny {
  const schema = z.string() // File URL after upload

  if (required) {
    return schema.min(1, { message: 'Please upload a file' })
  }

  return schema.optional().or(z.literal(''))
}

// Create a schema for an entire step (multiple questions)
// Questions with depends_on are made optional in the schema since they may be hidden
// In post_payment mode, all fields are optional (user can save progress without completing everything)
export function createStepSchema(
  questions: ServiceQuestion[],
  mode: 'pre_payment' | 'post_payment' = 'post_payment'
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const question of questions) {
    // In post_payment mode, all fields are optional
    // In pre_payment mode, respect the database validation settings
    // Questions with depends_on are always optional (validated at runtime based on visibility)
    const forceOptional = mode === 'post_payment' || !!question.depends_on
    shape[question.question_key] = createQuestionSchema(question, forceOptional)
  }

  return z.object(shape)
}

// Pre-defined schemas for known services (for type safety)
export const gstRegistrationStep1Schema = z.object({
  business_type: z.enum([
    'proprietorship',
    'partnership',
    'llp',
    'pvt_ltd',
    'opc',
    'huf',
  ]),
  trade_name: z.string().max(100).optional().or(z.literal('')),
})

export const gstRegistrationStep2Schema = z.object({
  principal_address: z.string().min(20).max(500),
  state: z.string().min(1, 'Please select a state'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid PIN code'),
})

export const gstRegistrationStep3Schema = z.object({
  nature_of_business: z.array(z.string()).min(1, 'Select at least one option'),
  business_activity_description: z.string().min(50).max(500),
})

// Combined schema for full GST Registration questionnaire
export const gstRegistrationFullSchema = z.object({
  ...gstRegistrationStep1Schema.shape,
  ...gstRegistrationStep2Schema.shape,
  ...gstRegistrationStep3Schema.shape,
})

export type GstRegistrationFormValues = z.infer<typeof gstRegistrationFullSchema>
