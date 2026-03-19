'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState, useMemo } from 'react'
import type { WorkflowDisplayStage } from '@/lib/types'

interface FilingTimelineProps {
  className?: string
  steps?: WorkflowDisplayStage[]
  serviceName?: string
}

// Default fallback steps
const DEFAULT_STEPS: WorkflowDisplayStage[] = [
  { step: 1, title: 'Document Collection', timeline: 'Day 0-2', body: '', visual: 'checklist' },
  { step: 2, title: 'DSC Application', timeline: 'Day 2-4', body: '', visual: 'form' },
  { step: 3, title: 'Name Approval', timeline: 'Day 4-7', body: '', visual: 'form' },
  { step: 4, title: 'MOA/AOA Drafting', timeline: 'Day 7-9', body: '', visual: 'form' },
  { step: 5, title: 'MCA Filing', timeline: 'Day 9-12', body: '', visual: 'form' },
  { step: 6, title: 'Certificate Delivery', timeline: 'Day 12-14', body: '', visual: 'stamp', isCompletion: true },
]

interface MarkerConfig {
  x: number
  y: number
  boxPosition: 'above' | 'below'
}

interface LayoutConfig {
  viewBox: string
  width: number
  height: number
  roadPath: string
  markers: MarkerConfig[]
}

// Card dimensions
const CARD_WIDTH = 130
const CARD_GAP = 12 // Gap between number and card
const MARKER_RADIUS = 12 // Radius of the number circle

// Side padding for cards
const SIDE_PADDING = 20

// 3-step layout
const LAYOUT_3: LayoutConfig = {
  viewBox: `-${SIDE_PADDING} 0 ${900 + SIDE_PADDING * 2} 180`,
  width: 900 + SIDE_PADDING * 2,
  height: 180,
  roadPath: 'M 50 90 L 850 90',
  markers: [
    { x: 150, y: 90, boxPosition: 'below' },
    { x: 450, y: 90, boxPosition: 'below' },
    { x: 750, y: 90, boxPosition: 'below' },
  ],
}

// 4-step layout
const LAYOUT_4: LayoutConfig = {
  viewBox: `-${SIDE_PADDING} 0 ${900 + SIDE_PADDING * 2} 260`,
  width: 900 + SIDE_PADDING * 2,
  height: 260,
  roadPath: `M 50 60 L 220 60 Q 280 60 280 120 L 280 200 Q 280 240 340 240 L 850 240`,
  markers: [
    { x: 120, y: 60, boxPosition: 'below' },
    { x: 280, y: 160, boxPosition: 'above' },
    { x: 520, y: 240, boxPosition: 'below' },
    { x: 780, y: 240, boxPosition: 'below' },
  ],
}

// 5-step layout - S curve
const LAYOUT_5: LayoutConfig = {
  viewBox: `-${SIDE_PADDING} 0 ${900 + SIDE_PADDING * 2} 320`,
  width: 900 + SIDE_PADDING * 2,
  height: 320,
  roadPath: `M 50 50 L 160 50 Q 220 50 220 110 L 220 210 Q 220 270 280 270 L 620 270 Q 680 270 680 210 L 680 110 Q 680 50 740 50 L 850 50`,
  markers: [
    { x: 90, y: 50, boxPosition: 'below' },
    { x: 220, y: 160, boxPosition: 'above' },
    { x: 450, y: 270, boxPosition: 'below' },
    { x: 680, y: 160, boxPosition: 'above' },
    { x: 810, y: 50, boxPosition: 'below' },
  ],
}

// 6-step layout - more looped
const LAYOUT_6: LayoutConfig = {
  viewBox: `-${SIDE_PADDING} 0 ${900 + SIDE_PADDING * 2} 380`,
  width: 900 + SIDE_PADDING * 2,
  height: 380,
  roadPath: `M 40 50 L 120 50 Q 170 50 170 100 L 170 180 Q 170 230 220 230 L 350 230 Q 400 230 400 180 L 400 100 Q 400 50 450 50 L 550 50 Q 600 50 600 100 L 600 180 Q 600 230 650 230 L 780 230 Q 830 230 830 180 L 830 100 Q 830 50 860 50`,
  markers: [
    { x: 70, y: 50, boxPosition: 'below' },
    { x: 170, y: 140, boxPosition: 'above' },
    { x: 285, y: 230, boxPosition: 'below' },
    { x: 500, y: 50, boxPosition: 'below' },
    { x: 715, y: 230, boxPosition: 'below' },
    { x: 830, y: 140, boxPosition: 'above' },
  ],
}

const getLayoutForStepCount = (count: number): LayoutConfig => {
  if (count <= 3) return LAYOUT_3
  if (count <= 4) return LAYOUT_4
  if (count <= 5) return LAYOUT_5
  return LAYOUT_6
}

interface CardPosition {
  x: number
  y: number
  width: number
  height: number
}

// Check if two rectangles overlap
function rectsOverlap(a: CardPosition, b: CardPosition, padding: number = 8): boolean {
  return !(
    a.x + a.width + padding < b.x ||
    b.x + b.width + padding < a.x ||
    a.y + a.height + padding < b.y ||
    b.y + b.height + padding < a.y
  )
}

// Resolve overlaps by shifting cards horizontally
function resolveOverlaps(positions: CardPosition[], markers: MarkerConfig[]): CardPosition[] {
  const resolved = [...positions]

  for (let i = 0; i < resolved.length; i++) {
    for (let j = i + 1; j < resolved.length; j++) {
      if (rectsOverlap(resolved[i], resolved[j])) {
        // Determine which card to shift based on marker positions
        const markerI = markers[i]
        const markerJ = markers[j]

        // Calculate overlap amount
        const overlapX = Math.min(
          resolved[i].x + resolved[i].width - resolved[j].x,
          resolved[j].x + resolved[j].width - resolved[i].x
        )

        // Shift the card that's more to the right, further right
        // Or shift the card that's more to the left, further left
        if (markerI.x < markerJ.x) {
          resolved[j].x += overlapX / 2 + 10
          resolved[i].x -= overlapX / 2 + 10
        } else {
          resolved[i].x += overlapX / 2 + 10
          resolved[j].x -= overlapX / 2 + 10
        }
      }
    }
  }

  return resolved
}

export function FilingTimeline({ className, steps, serviceName }: FilingTimelineProps) {
  const workflowSteps = steps && steps.length > 0 ? steps : DEFAULT_STEPS
  const layout = getLayoutForStepCount(workflowSteps.length)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardHeights, setCardHeights] = useState<number[]>([])
  const hasMeasured = useRef(false)

  // Memoize displaySteps to prevent infinite re-renders
  const displaySteps = useMemo(() => workflowSteps.map((step, index) => ({
    number: step.step || index + 1,
    title: step.title,
    timeline: step.timeline,
    isCompletion: step.isCompletion || false,
  })), [workflowSteps])

  // Measure card heights after render - only once per mount
  useEffect(() => {
    if (containerRef.current && !hasMeasured.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const cards = containerRef.current.querySelectorAll('[data-card]')
          const heights = Array.from(cards).map(card => card.getBoundingClientRect().height)
          if (heights.length > 0) {
            setCardHeights(heights)
            hasMeasured.current = true
          }
        }
      })
    }
  }, [displaySteps.length])

  // Calculate initial positions - ensure cards never overlap with marker circles
  const initialPositions: CardPosition[] = layout.markers.map((marker, index) => {
    // Use measured height + buffer to account for rendering differences
    const height = (cardHeights[index] || 70) + 14
    const x = marker.x - CARD_WIDTH / 2
    // Position card with gap from the edge of the marker circle (not center)
    const y = marker.boxPosition === 'above'
      ? marker.y - MARKER_RADIUS - CARD_GAP - height
      : marker.y + MARKER_RADIUS + CARD_GAP
    return { x, y, width: CARD_WIDTH, height }
  })

  // Resolve any overlaps
  const cardPositions = resolveOverlaps(initialPositions, layout.markers)

  // Calculate dynamic height based on card positions
  const maxCardBottom = cardPositions.reduce((max, pos) => {
    return Math.max(max, pos.y + pos.height)
  }, 0)
  const minCardTop = cardPositions.reduce((min, pos) => {
    return Math.min(min, pos.y)
  }, Infinity)

  // Dynamic height: from top of highest card to bottom of lowest card, plus small padding
  const dynamicHeight = Math.max(layout.height, maxCardBottom + 20)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">TIMELINE</p>
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Your Filing Journey</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Projected from today - starts when you pay
        </p>
      </div>

      {/* Desktop Roadmap */}
      <div ref={containerRef} className="hidden lg:block relative" style={{ height: dynamicHeight }}>
        <svg
          viewBox={`-${SIDE_PADDING} ${minCardTop < 0 ? minCardTop - 10 : -10} ${layout.width} ${dynamicHeight + 20}`}
          className="w-full"
          style={{ height: dynamicHeight }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Road */}
          <path
            d={layout.roadPath}
            fill="none"
            className="stroke-muted-foreground/25 dark:stroke-muted-foreground/15"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={layout.roadPath}
            fill="none"
            className="stroke-muted-foreground/50 dark:stroke-white/70"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 5"
          />

          {/* Step markers */}
          {displaySteps.map((step, index) => {
            const marker = layout.markers[index]
            if (!marker) return null
            const isLast = index === displaySteps.length - 1

            return (
              <g key={step.number}>
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={12}
                  className={isLast ? 'fill-[hsl(var(--ollvy-green))]' : 'fill-foreground'}
                />
                <text
                  x={marker.x}
                  y={marker.y + 4}
                  textAnchor="middle"
                  className={cn('text-[11px] font-semibold', isLast ? 'fill-white' : 'fill-background')}
                >
                  {step.number}
                </text>
              </g>
            )
          })}

          {/* Cards */}
          {displaySteps.map((step, index) => {
            const pos = cardPositions[index]
            if (!pos) return null
            const isLast = index === displaySteps.length - 1

            return (
              <foreignObject
                key={`card-${step.number}`}
                x={pos.x - 20}
                y={pos.y - 20}
                width={CARD_WIDTH + 40}
                height={pos.height + 60}
                overflow="visible"
                style={{ pointerEvents: 'none' }}
              >
                <div className="w-full h-full flex items-center justify-center" style={{ pointerEvents: 'none' }}>
                  <div
                    data-card
                    className={cn(
                      'rounded-lg p-2.5 shadow-sm border cursor-pointer transition-all duration-300 ease-out hover:scale-[1.35] hover:shadow-xl hover:z-50',
                      isLast
                        ? 'bg-[hsl(var(--ollvy-green))] border-[hsl(var(--ollvy-green))] text-white hover:shadow-[hsl(var(--ollvy-green))]/30'
                        : 'bg-background border-border hover:shadow-foreground/10'
                    )}
                    style={{ width: CARD_WIDTH, pointerEvents: 'auto' }}
                  >
                    <p
                      className={cn(
                        'font-mono text-[11px] leading-snug text-center transition-all duration-300',
                        isLast ? 'text-white' : 'text-foreground'
                      )}
                    >
                      {step.title}
                    </p>
                    <p
                      className={cn(
                        'font-mono text-[12px] text-center mt-1.5 transition-all duration-300',
                        isLast ? 'text-white/80' : 'text-[hsl(var(--ollvy-green-fg))]'
                      )}
                    >
                      {step.timeline}
                    </p>
                  </div>
                </div>
              </foreignObject>
            )
          })}
        </svg>
      </div>

      {/* Tablet */}
      <div className="hidden md:block lg:hidden">
        <div className="relative py-6">
          <div className="absolute top-1/2 left-0 right-0 h-7 bg-muted-foreground/20 rounded-full -translate-y-1/2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-background" />
            </div>
          </div>

          <div className="relative flex justify-between items-center px-1">
            {displaySteps.map((step, index) => (
              <div
                key={step.number}
                className="flex flex-col items-center"
                style={{ width: `${100 / displaySteps.length}%` }}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold z-10 mb-2',
                    index === displaySteps.length - 1
                      ? 'bg-[hsl(var(--ollvy-green))] text-white'
                      : 'bg-foreground text-background'
                  )}
                >
                  {step.number}
                </div>
                <div
                  className={cn(
                    'rounded-lg p-2 w-[95px] text-center shadow-sm border',
                    index === displaySteps.length - 1
                      ? 'bg-[hsl(var(--ollvy-green))] border-[hsl(var(--ollvy-green))] text-white'
                      : 'bg-background border-border'
                  )}
                >
                  <p className={cn(
                    'font-mono text-[9px] leading-snug',
                    index === displaySteps.length - 1 ? 'text-white' : 'text-foreground'
                  )}>
                    {step.title}
                  </p>
                  <p className={cn(
                    'font-mono text-[10px] mt-1',
                    index === displaySteps.length - 1 ? 'text-white/80' : 'text-[hsl(var(--ollvy-green-fg))]'
                  )}>
                    {step.timeline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden relative">
        <div className="absolute left-[14px] top-0 bottom-0 w-0.5 bg-muted-foreground/20" />

        <div className="space-y-3">
          {displaySteps.map((step, index) => (
            <div key={step.number} className="relative flex items-center gap-3">
              <div
                className={cn(
                  'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold z-10',
                  index === displaySteps.length - 1
                    ? 'bg-[hsl(var(--ollvy-green))] text-white'
                    : 'bg-foreground text-background'
                )}
              >
                {step.number}
              </div>

              <div
                className={cn(
                  'flex-1 rounded-lg p-3 border shadow-sm',
                  index === displaySteps.length - 1
                    ? 'bg-[hsl(var(--ollvy-green))] border-[hsl(var(--ollvy-green))] text-white'
                    : 'bg-background border-border'
                )}
              >
                <p
                  className={cn(
                    'font-mono text-xs leading-snug',
                    index === displaySteps.length - 1 ? 'text-white' : 'text-foreground'
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    'font-mono text-[12px] mt-1',
                    index === displaySteps.length - 1 ? 'text-white/80' : 'text-[hsl(var(--ollvy-green-fg))]'
                  )}
                >
                  {step.timeline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-l-[3px] border-[hsl(var(--ollvy-green))]/30 pl-3 bg-[hsl(var(--ollvy-green))]/5 py-2 pr-3 rounded-r-lg">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Note:</span> Government processing times are outside
          Ollvy's control. We proactively follow up on your behalf.
        </p>
      </div>
    </div>
  )
}
