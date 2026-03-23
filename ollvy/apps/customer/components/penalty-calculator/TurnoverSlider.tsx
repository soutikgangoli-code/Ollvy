'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TurnoverSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  maxCrore?: number
  className?: string
}

const BREAKPOINTS = [
  100000, 500000, 1000000, 5000000, 10000000,
  50000000, 100000000, 500000000, 1000000000, 5000000000,
]

function formatIndianCurrency(value: number): string {
  if (value === 0) return '₹0'
  if (value >= 10000000) {
    const crores = value / 10000000
    if (crores >= 100) return `₹${Math.round(crores)} Cr`
    return crores % 1 === 0 ? `₹${crores} Cr` : `₹${crores.toFixed(1)} Cr`
  }
  if (value >= 100000) {
    const lakhs = value / 100000
    return lakhs % 1 === 0 ? `₹${lakhs} L` : `₹${lakhs.toFixed(1)} L`
  }
  return `₹${value.toLocaleString('en-IN')}`
}

function sliderToValue(sliderPos: number, maxValue: number): number {
  if (sliderPos === 0 || maxValue <= 1) return 0
  const minLog = Math.log(1)
  const maxLog = Math.log(maxValue)
  const scale = (maxLog - minLog) / 100
  if (!Number.isFinite(scale) || scale === 0) return 0
  return Math.round(Math.exp(minLog + scale * sliderPos))
}

function valueToSlider(value: number, maxValue: number): number {
  if (value <= 0 || maxValue <= 1) return 0
  const minLog = Math.log(1)
  const maxLog = Math.log(maxValue)
  const scale = (maxLog - minLog) / 100
  if (!Number.isFinite(scale) || scale === 0) return 0
  return Math.round((Math.log(value) - minLog) / scale)
}

function parseIndianInput(input: string): number {
  const cleaned = input.replace(/[₹,\s]/g, '').toLowerCase()
  if (cleaned.includes('cr')) {
    const num = parseFloat(cleaned.replace(/cr(ore)?/i, ''))
    return isNaN(num) ? 0 : Math.round(num * 10000000)
  }
  if (cleaned.includes('l')) {
    const num = parseFloat(cleaned.replace(/l(akh)?/i, ''))
    return isNaN(num) ? 0 : Math.round(num * 100000)
  }
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : Math.round(num)
}

export function TurnoverSlider({
  value,
  onChange,
  label = 'Annual Turnover',
  maxCrore = 500,
  className,
}: TurnoverSliderProps) {
  const maxValue = maxCrore * 10000000
  const [sliderValue, setSliderValue] = useState(() => valueToSlider(value, maxValue))
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      setSliderValue(valueToSlider(value, maxValue))
    }
  }, [value, maxValue, isEditing])

  const handleSliderChange = useCallback((newValue: number[]) => {
    const pos = newValue[0]
    setSliderValue(pos)
    const actualValue = sliderToValue(pos, maxValue)
    onChange(actualValue)
  }, [onChange, maxValue])

  const handleInputFocus = useCallback(() => {
    setIsEditing(true)
    setInputValue(value.toString())
  }, [value])

  const handleInputBlur = useCallback(() => {
    setIsEditing(false)
    const parsed = parseIndianInput(inputValue)
    const clamped = Math.min(Math.max(parsed, 0), maxValue)
    onChange(clamped)
    setInputValue('')
  }, [inputValue, onChange, maxValue])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur()
    }
  }, [])

  const ticks = useMemo(() => {
    return BREAKPOINTS.filter(bp => bp <= maxValue).map(bp => ({
      value: bp,
      position: valueToSlider(bp, maxValue),
      label: formatIndianCurrency(bp).replace('₹', ''),
    }))
  }, [maxValue])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="flex items-center gap-3">
          <span className="text-xl font-mono font-semibold text-foreground tracking-tight">
            {formatIndianCurrency(value)}
          </span>
          <Input
            type="text"
            value={isEditing ? inputValue : ''}
            placeholder={formatIndianCurrency(value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-24 h-8 text-xs font-mono text-right bg-muted/50 border-border/50"
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
