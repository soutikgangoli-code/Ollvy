'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { HelpCircle } from 'lucide-react'
import type { ServiceQuestion } from '@/lib/questionnaire/types'

interface QuestionFieldProps {
  question: ServiceQuestion
}

export function QuestionField({ question }: QuestionFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = errors[question.question_key]

  return (
    <div className="space-y-2">
      {/* Label with optional help tooltip */}
      <div className="flex items-center gap-2">
        <Label
          htmlFor={question.question_key}
          className={cn(error && 'text-destructive')}
        >
          {question.question_label}
          {question.validation?.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </Label>
        {question.help_text && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                <p>{question.help_text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Field based on question type */}
      {renderField(question, control)}

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  )
}

function renderField(
  question: ServiceQuestion,
  control: ReturnType<typeof useFormContext>['control']
) {
  switch (question.question_type) {
    case 'text':
      return (
        <Controller
          name={question.question_key}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id={question.question_key}
              placeholder={question.placeholder}
              className="w-full h-11 bg-background"
            />
          )}
        />
      )

    case 'textarea':
      return (
        <Controller
          name={question.question_key}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Textarea
              {...field}
              id={question.question_key}
              placeholder={question.placeholder}
              className="w-full min-h-[120px] bg-background resize-none"
            />
          )}
        />
      )

    case 'number':
      return (
        <Controller
          name={question.question_key}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id={question.question_key}
              type="number"
              placeholder={question.placeholder}
              min={question.validation?.min}
              max={question.validation?.max}
              className="w-full"
            />
          )}
        />
      )

    case 'select':
      return (
        <Controller
          name={question.question_key}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger id={question.question_key} className="w-full h-11 bg-background">
                <SelectValue placeholder={question.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      )

    case 'radio':
      return (
        <Controller
          name={question.question_key}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-2 gap-3"
            >
              {question.options?.map((option) => {
                const isSelected = field.value === option.value
                return (
                  <label
                    key={option.value}
                    htmlFor={`${question.question_key}-${option.value}`}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/30'
                    )}
                  >
                    <RadioGroupItem value={option.value} id={`${question.question_key}-${option.value}`} />
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                  </label>
                )
              })}
            </RadioGroup>
          )}
        />
      )

    case 'multiselect':
      return (
        <Controller
          name={question.question_key}
          control={control}
          defaultValue={[]}
          render={({ field }) => {
            const selectedValues = Array.isArray(field.value) ? field.value : []

            const handleToggle = (value: string) => {
              const newValues = selectedValues.includes(value)
                ? selectedValues.filter((v: string) => v !== value)
                : [...selectedValues, value]
              field.onChange(newValues)
            }

            return (
              <div className="grid grid-cols-2 gap-3">
                {question.options?.map((option) => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <label
                      key={option.value}
                      htmlFor={`${question.question_key}-${option.value}`}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      )}
                    >
                      <Checkbox
                        id={`${question.question_key}-${option.value}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(option.value)}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {option.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            )
          }}
        />
      )

    case 'date':
      return (
        <Controller
          name={question.question_key}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id={question.question_key}
              type="date"
              className="w-full"
            />
          )}
        />
      )

    default:
      return (
        <Controller
          name={question.question_key}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id={question.question_key}
              placeholder={question.placeholder}
              className="w-full"
            />
          )}
        />
      )
  }
}
