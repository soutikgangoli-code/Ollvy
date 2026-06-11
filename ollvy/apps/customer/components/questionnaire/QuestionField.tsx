'use client'

import { useState } from 'react'
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
  mode?: 'pre_payment' | 'post_payment'
}

export function QuestionField({ question, mode = 'post_payment' }: QuestionFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = errors[question.question_key]

  // In post_payment mode, use muted colors for hints/warnings instead of red
  const isPostPayment = mode === 'post_payment'

  return (
    <div className="space-y-2">
      {/* Label with optional help tooltip */}
      <div className="flex items-center gap-2">
        <Label
          htmlFor={question.question_key}
          className=""
        >
          {question.question_label}
          {question.validation?.required && !isPostPayment && (
            <span className="text-muted-foreground ml-1">*</span>
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

      {/* Error/hint message - always light grey */}
      {error && (
        <p className="text-sm text-muted-foreground">
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
          render={({ field }) => (
            <MultiSelectField
              questionKey={question.question_key}
              options={question.options ?? []}
              value={Array.isArray(field.value) ? field.value : []}
              onChange={field.onChange}
            />
          )}
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

// Edit distance for typo tolerance.
function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const curr = [i]
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
    prev = curr
  }
  return prev[n]
}

// Forgiving search: matches on substring, on out-of-order/partial typing
// (subsequence), and on typos (per-word edit distance). So "clothign", "footwer"
// or "25" all still surface the right class.
function fuzzyMatch(query: string, label: string): boolean {
  const q = query.toLowerCase().trim()
  if (!q) return true
  const t = label.toLowerCase()
  if (t.includes(q)) return true
  // subsequence: query characters appear in order somewhere in the label
  let i = 0
  for (let k = 0; k < t.length && i < q.length; k++) {
    if (t[k] === q[i]) i++
  }
  if (i === q.length) return true
  // typo tolerance against each word
  const threshold = q.length <= 4 ? 1 : 2
  return t.split(/[^a-z0-9]+/).some((w) => w.length > 0 && levenshtein(q, w) <= threshold)
}

// Multi-select with an optional search box (shown for long lists, e.g. trademark
// classes). Selected values are an array of option values.
function MultiSelectField({
  questionKey,
  options,
  value,
  onChange,
}: {
  questionKey: string
  options: { value: string; label: string }[]
  value: string[]
  onChange: (next: string[]) => void
}) {
  const [query, setQuery] = useState('')
  const showSearch = options.length > 12
  const filtered = query.trim() ? options.filter((o) => fuzzyMatch(query, o.label)) : options

  const toggle = (val: string) =>
    onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val])

  return (
    <div className="space-y-3">
      {showSearch && (
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories..."
          className="w-full"
        />
      )}
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-2.5', showSearch && 'max-h-72 overflow-y-auto pr-1')}>
        {filtered.map((option) => {
          const isSelected = value.includes(option.value)
          return (
            <label
              key={option.value}
              htmlFor={`${questionKey}-${option.value}`}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              )}
            >
              <Checkbox
                id={`${questionKey}-${option.value}`}
                checked={isSelected}
                onCheckedChange={() => toggle(option.value)}
              />
              <span className="text-sm font-medium text-foreground">{option.label}</span>
            </label>
          )
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground py-2">
            No categories match "{query}".
          </p>
        )}
      </div>
    </div>
  )
}
