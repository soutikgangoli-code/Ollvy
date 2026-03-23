'use client'

import { useState, useCallback, useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface MonthsLateSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  maxMonths?: number
  className?: string
}

function formatMonths(months: number): string {
  if (months === 1) return '1 month'
  if (months < 12) return `${months} months`
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (remainingMonths === 0) return `${years}y`
  return `${years}y ${remainingMonths}mo`
}

export function MonthsLateSlider({
  value,
  onChange,
  label = 'Months Late',
  maxMonths = 60,
  className,
}: MonthsLateSliderProps) {
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const marks = useMemo(() => {
    const ticks = [1, 3, 6, 12, 24, 36, 48, 60].filter(t => t <= maxMonths)
    return ticks.map(t => ({
      value: t,
      position: maxMonths <= 1 ? 0 : ((t - 1) / (maxMonths - 1)) * 100,
      label: t >= 12 ? `${t / 12}y` : `${t}m`,
    }))
  }, [maxMonths])

  const handleSliderChange = useCallback((newValue: number[]) => {
    onChange(newValue[0])
  }, [onChange])

  const handleInputFocus = useCallback(() => {
    setIsEditing(true)
    setInputValue(value.toString())
  }, [value])

  const handleInputBlur = useCallback(() => {
    setIsEditing(false)
    const parsed = parseInt(inputValue, 10)
    if (!isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, 1), maxMonths)
      onChange(clamped)
    }
    setInputValue('')
  }, [inputValue, onChange, maxMonths])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur()
    }
  }, [])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-foreground">
            {formatMonths(value)}
          </span>
          <Input
            type="number"
            min={1}
            max={maxMonths}
            value={isEditing ? inputValue : ''}
            placeholder={value.toString()}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-14 h-8 text-xs font-mono text-right bg-muted/50 border-border/50"
          />
        </div>
      </div>

      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={1}
        max={maxMonths}
        step={1}
        className="w-full"
      />

      <div className="relative h-4 -mt-1">
        {marks.map((mark) => (
          <span
            key={mark.value}
            className="absolute transform -translate-x-1/2 text-[9px] font-mono text-muted-foreground/70"
            style={{ left: `${mark.position}%` }}
          >
            {mark.label}
          </span>
        ))}
      </div>
    </div>
  )
}
