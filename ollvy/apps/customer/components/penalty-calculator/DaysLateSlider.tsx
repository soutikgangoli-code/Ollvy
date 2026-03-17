'use client'

import { useState, useCallback, useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DaysLateSliderProps {
  value: number
  onChange: (value: number) => void
  maxDays?: number
  label?: string
  className?: string
}

function formatDays(days: number): string {
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`
  if (days < 365) {
    const months = Math.floor(days / 30)
    return `${days}d (${months}mo)`
  }
  const years = Math.floor(days / 365)
  const remainingMonths = Math.floor((days % 365) / 30)
  if (remainingMonths === 0) return `${days}d (${years}y)`
  return `${days}d (${years}y ${remainingMonths}mo)`
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
    <div className={cn('space-y-4', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-foreground">
            {formatDays(value)}
          </span>
          <Input
            type="number"
            min={1}
            max={maxDays}
            value={isEditing ? inputValue : ''}
            placeholder={value.toString()}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-16 h-8 text-xs font-mono text-right bg-muted/50 border-border/50"
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
