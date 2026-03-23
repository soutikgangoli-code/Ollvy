'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface EmployeeCountSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  maxCount?: number
  className?: string
}

const MARKS = [1, 5, 10, 20, 50, 100, 250, 500, 1000, 5000, 10000]

function sliderToValue(sliderPos: number, maxValue: number): number {
  if (sliderPos === 0 || maxValue <= 1) return 1
  const minLog = Math.log(1)
  const maxLog = Math.log(maxValue)
  const scale = (maxLog - minLog) / 100
  if (!Number.isFinite(scale) || scale === 0) return 1
  return Math.max(1, Math.round(Math.exp(minLog + scale * sliderPos)))
}

function valueToSlider(value: number, maxValue: number): number {
  if (value <= 1 || maxValue <= 1) return 0
  const minLog = Math.log(1)
  const maxLog = Math.log(maxValue)
  const scale = (maxLog - minLog) / 100
  if (!Number.isFinite(scale) || scale === 0) return 0
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

  const ticks = useMemo(() => {
    return MARKS.filter(m => m <= maxCount).map(m => ({
      value: m,
      position: valueToSlider(m, maxCount),
      label: m >= 1000 ? `${m / 1000}k` : m.toString(),
    }))
  }, [maxCount])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-foreground">
            {value.toLocaleString('en-IN')}
          </span>
          <Input
            type="number"
            min={1}
            max={maxCount}
            value={isEditing ? inputValue : ''}
            placeholder={value.toString()}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-20 h-8 text-xs font-mono text-right bg-muted/50 border-border/50"
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

      <div className="relative h-4 -mt-1">
        {ticks.filter((_, i) => i % 2 === 0).map((tick) => (
          <span
            key={tick.value}
            className="absolute transform -translate-x-1/2 text-[9px] font-mono text-muted-foreground/70"
            style={{ left: `${tick.position}%` }}
          >
            {tick.label}
          </span>
        ))}
      </div>
    </div>
  )
}
