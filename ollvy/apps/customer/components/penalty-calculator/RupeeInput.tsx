'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface RupeeInputProps {
  value: number // in rupees (integer)
  onChange: (value: number) => void
  label?: string
  helpText?: string
  required?: boolean
  placeholder?: string
  className?: string
}

// Format number in Indian number system (12,45,000)
function formatIndian(num: number): string {
  if (num === 0) return ''
  const str = num.toString()
  const lastThree = str.slice(-3)
  const remaining = str.slice(0, -3)

  if (remaining === '') return lastThree
  return remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
}

// Parse Indian formatted number back to integer
function parseIndian(str: string): number {
  const cleaned = str.replace(/[,\s₹]/g, '')
  const num = parseInt(cleaned, 10)
  return isNaN(num) ? 0 : num
}

export function RupeeInput({
  value,
  onChange,
  label,
  helpText,
  required = false,
  placeholder = 'Enter amount in ₹',
  className,
}: RupeeInputProps) {
  const [displayValue, setDisplayValue] = useState(value > 0 ? formatIndian(value) : '')
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    // Show raw number for editing
    setDisplayValue(value > 0 ? value.toString() : '')
  }, [value])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    // Parse and format
    const parsed = parseIndian(displayValue)
    onChange(parsed)
    setDisplayValue(parsed > 0 ? formatIndian(parsed) : '')
  }, [displayValue, onChange])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    // Allow only digits while typing
    const cleaned = raw.replace(/[^\d]/g, '')
    setDisplayValue(cleaned)

    // Update value in real-time
    const parsed = parseInt(cleaned, 10)
    if (!isNaN(parsed)) {
      onChange(parsed)
    } else if (cleaned === '') {
      onChange(0)
    }
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur()
    }
  }, [])

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
          ₹
        </span>
        <Input
          type="text"
          inputMode="numeric"
          value={displayValue}
          placeholder={placeholder.replace('₹', '')}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="pl-7 font-mono"
        />
      </div>
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  )
}
