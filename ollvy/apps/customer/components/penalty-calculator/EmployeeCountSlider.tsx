'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface EmployeeCountSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  maxCount?: number // default 10000
  className?: string
}

// Marks for the slider
const MARKS = [1, 5, 10, 20, 50, 100, 250, 500, 1000, 5000, 10000]

// Convert linear slider position (0-100) to actual value using logarithmic scale
function sliderToValue(sliderPos: number, maxValue: number): number {
  if (sliderPos === 0) return 1
  const minLog = Math.log(1)
  const maxLog = Math.log(maxValue)
  const scale = (maxLog - minLog) / 100
  return Math.max(1, Math.round(Math.exp(minLog + scale * sliderPos)))
}

// Convert actual value to linear slider position (0-100)
function valueToSlider(value: number, maxValue: number): number {
  if (value <= 1) return 0
  const minLog = Math.log(1)
  const maxLog = Math.log(maxValue)
  const scale = (maxLog - minLog) / 100
  return Math.round((Math.log(value) - minLog) / scale)
}

export function EmployeeCountSlider({
  value,
  onChange,
  label = 'Number of Employees',
  maxCount = 10000,
  className,
}: EmployeeCountSliderProps) {
  const [sliderValue, setSliderValue] = useState(() => valueToSlider(value, maxCount))
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Sync slider when external value changes
  useEffect(() => {
    if (!isEditing) {
      setSliderValue(valueToSlider(value, maxCount))
    }
  }, [value, maxCount, isEditing])

  const handleSliderChange = useCallback((newValue: number[]) => {
    const pos = newValue[0]
    setSliderValue(pos)
    const actualValue = sliderToValue(pos, maxCount)
    onChange(actualValue)
  }, [onChange, maxCount])

  const handleInputFocus = useCallback(() => {
    setIsEditing(true)
    setInputValue(value.toString())
  }, [value])

  const handleInputBlur = useCallback(() => {
    setIsEditing(false)
    const parsed = parseInt(inputValue, 10)
    if (!isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, 1), maxCount)
      onChange(clamped)
    }
    setInputValue('')
  }, [inputValue, onChange, maxCount])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur()
    }
  }, [])

  // Generate tick marks for display
  const ticks = useMemo(() => {
    return MARKS.filter(m => m <= maxCount).map(m => ({
      value: m,
      position: valueToSlider(m, maxCount),
      label: m >= 1000 ? `${m / 1000}k` : m.toString(),
    }))
  }, [maxCount])

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            {value.toLocaleString('en-IN')} employees
          </span>
          <Input
            type="number"
            min={1}
            max={maxCount}
            value={isEditing ? inputValue : ''}
            placeholder={isEditing ? '' : value.toString()}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-24 h-8 text-sm text-right"
          />
        </div>
      </div>

      <Slider
        value={[sliderValue]}
        onValueChange={handleSliderChange}
        min={0}
        max={100}
        step={1}
        className="w-full"
      />

      {/* Tick marks */}
      <div className="relative h-4">
        {ticks.map((tick, i) => (
          <div
            key={tick.value}
            className="absolute transform -translate-x-1/2 text-[10px] text-muted-foreground"
            style={{ left: `${tick.position}%` }}
          >
            {i % 2 === 0 && tick.label}
          </div>
        ))}
      </div>
    </div>
  )
}
