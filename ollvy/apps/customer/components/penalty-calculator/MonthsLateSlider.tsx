'use client'

import { useState, useCallback, useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface MonthsLateSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  maxMonths?: number // default 60 (5 years)
  className?: string
}

// Format months as human readable
function formatMonths(months: number): string {
  if (months < 12) {
    return `${months} month${months === 1 ? '' : 's'} late`
  }
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? '' : 's'} late`
  }
  return `${years} year${years === 1 ? '' : 's'} ${remainingMonths} month${remainingMonths === 1 ? '' : 's'} late`
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

  // Marks: 1, 3, 6, 12, 24, 36, 48, 60
  const marks = useMemo(() => {
    const ticks = [1, 3, 6, 12, 24, 36, 48, 60].filter(t => t <= maxMonths)
    return ticks.map(t => ({
      value: t,
      position: ((t - 1) / (maxMonths - 1)) * 100,
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
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {formatMonths(value)}
          </span>
          <Input
            type="number"
            min={1}
            max={maxMonths}
            value={isEditing ? inputValue : ''}
            placeholder={isEditing ? '' : value.toString()}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-16 h-8 text-sm text-right"
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

      {/* Tick marks */}
      <div className="relative h-4">
        {marks.map((mark) => (
          <div
            key={mark.value}
            className="absolute transform -translate-x-1/2 text-[10px] text-muted-foreground"
            style={{ left: `${mark.position}%` }}
          >
            {mark.label}
          </div>
        ))}
      </div>
    </div>
  )
}
