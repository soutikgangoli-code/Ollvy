'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface DaysLateSliderProps {
  value: number
  onChange: (value: number) => void
  maxDays?: number // default 365, MCA uses 1095
  label?: string
  className?: string
}

// Format days as human readable
function formatDays(days: number): string {
  if (days < 365) {
    return `${days} days late`
  }
  if (days < 730) {
    const months = Math.floor(days / 30)
    return `${days} days (${months} months) late`
  }
  const years = Math.floor(days / 365)
  const remainingMonths = Math.floor((days % 365) / 30)
  if (remainingMonths === 0) {
    return `${days} days (${years} years) late`
  }
  return `${days} days (${years} years ${remainingMonths} months) late`
}

export function DaysLateSlider({
  value,
  onChange,
  maxDays = 365,
  label = 'Days Late',
  className,
}: DaysLateSliderProps) {
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Generate marks based on maxDays
  const marks = useMemo(() => {
    const baseTicks = [7, 30, 60, 90, 180, 270, 365]
    const extendedTicks = [548, 730, 1095]

    let allTicks = baseTicks.filter(t => t <= maxDays)
    if (maxDays > 365) {
      allTicks = [...allTicks, ...extendedTicks.filter(t => t <= maxDays)]
    }

    return allTicks.map(t => ({
      value: t,
      position: (t / maxDays) * 100,
      label: t >= 365 ? `${Math.floor(t / 365)}y` : `${t}d`,
    }))
  }, [maxDays])

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
      const clamped = Math.min(Math.max(parsed, 1), maxDays)
      onChange(clamped)
    }
    setInputValue('')
  }, [inputValue, onChange, maxDays])

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
            {formatDays(value)}
          </span>
          <Input
            type="number"
            min={1}
            max={maxDays}
            value={isEditing ? inputValue : ''}
            placeholder={isEditing ? '' : value.toString()}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-20 h-8 text-sm text-right"
          />
        </div>
      </div>

      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={1}
        max={maxDays}
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
