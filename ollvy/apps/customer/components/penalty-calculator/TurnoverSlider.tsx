'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface TurnoverSliderProps {
  value: number // in rupees
  onChange: (value: number) => void
  label?: string
  maxCrore?: number // default 500
  className?: string
}

// Breakpoints for logarithmic scale (in rupees)
const BREAKPOINTS = [
  100000,       // ₹1L
  500000,       // ₹5L
  1000000,      // ₹10L
  5000000,      // ₹50L
  10000000,     // ₹1Cr
  50000000,     // ₹5Cr
  100000000,    // ₹10Cr
  500000000,    // ₹50Cr
  1000000000,   // ₹100Cr
  5000000000,   // ₹500Cr
]

// Format value as human-readable Indian numbers
function formatIndianCurrency(value: number): string {
  if (value === 0) return '₹0'
  if (value >= 10000000) { // 1 Crore+
    const crores = value / 10000000
    if (crores >= 100) {
      return `₹${Math.round(crores)} Crore`
    }
    return crores % 1 === 0 ? `₹${crores} Crore` : `₹${crores.toFixed(1)} Crore`
  }
  if (value >= 100000) { // 1 Lakh+
    const lakhs = value / 100000
    return lakhs % 1 === 0 ? `₹${lakhs} Lakh` : `₹${lakhs.toFixed(1)} Lakh`
  }
  return `₹${value.toLocaleString('en-IN')}`
}

// Convert linear slider position (0-100) to actual value using logarithmic scale
function sliderToValue(sliderPos: number, maxValue: number): number {
  if (sliderPos === 0) return 0
  // Use logarithmic interpolation
  const minLog = Math.log(1)
  const maxLog = Math.log(maxValue)
  const scale = (maxLog - minLog) / 100
  return Math.round(Math.exp(minLog + scale * sliderPos))
}

// Convert actual value to linear slider position (0-100)
function valueToSlider(value: number, maxValue: number): number {
  if (value <= 0) return 0
  const minLog = Math.log(1)
  const maxLog = Math.log(maxValue)
  const scale = (maxLog - minLog) / 100
  return Math.round((Math.log(value) - minLog) / scale)
}

// Parse Indian format input (e.g., "1,50,000" or "1.5 Cr")
function parseIndianInput(input: string): number {
  const cleaned = input.replace(/[₹,\s]/g, '').toLowerCase()

  if (cleaned.includes('cr') || cleaned.includes('crore')) {
    const num = parseFloat(cleaned.replace(/cr(ore)?/i, ''))
    return isNaN(num) ? 0 : Math.round(num * 10000000)
  }
  if (cleaned.includes('l') || cleaned.includes('lakh')) {
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
  const maxValue = maxCrore * 10000000 // Convert crores to rupees
  const [sliderValue, setSliderValue] = useState(() => valueToSlider(value, maxValue))
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Sync slider when external value changes
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

  // Generate tick marks for display
  const ticks = useMemo(() => {
    return BREAKPOINTS.filter(bp => bp <= maxValue).map(bp => ({
      value: bp,
      position: valueToSlider(bp, maxValue),
      label: formatIndianCurrency(bp).replace('₹', ''),
    }))
  }, [maxValue])

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-emerald-700">
            {formatIndianCurrency(value)}
          </span>
          <Input
            type="text"
            value={isEditing ? inputValue : ''}
            placeholder={isEditing ? '' : formatIndianCurrency(value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-32 h-8 text-sm text-right"
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
