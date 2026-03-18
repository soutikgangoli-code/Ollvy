'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DBServiceExplainerStep } from '@/lib/data/services'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface ExplainerStepperProps {
  serviceName: string
  steps: DBServiceExplainerStep[]
}

export function ExplainerStepper({ serviceName, steps }: ExplainerStepperProps) {
  const [active, setActive] = useState(0)
  const navRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  // Update indicator position when active step changes
  useEffect(() => {
    if (navRef.current) {
      const activeButton = navRef.current.querySelector(`[data-step="${active}"]`) as HTMLElement
      if (activeButton) {
        setIndicator({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        })
      }
    }
  }, [active])

  // Initialize indicator position on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (navRef.current) {
        const activeButton = navRef.current.querySelector(`[data-step="${active}"]`) as HTMLElement
        if (activeButton) {
          setIndicator({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          })
        }
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!steps || steps.length === 0) return null

  const step = steps[active]

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden mt-6">
      {/* Header with tab navigation and smooth underline */}
      <div className="border-b border-border">
        <div
          ref={navRef}
          className="flex items-center gap-6 px-6 relative overflow-x-auto scrollbar-none"
        >
          {steps.map((s, i) => (
            <button
              key={i}
              data-step={i}
              onClick={() => setActive(i)}
              className={cn(
                'shrink-0 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                active === i
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {s.title}
            </button>
          ))}
          {/* Sliding underline indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
            style={{
              left: indicator.left,
              width: indicator.width,
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="p-6 min-h-[120px] flex flex-col"
        >
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {step.body}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation - hide on last step */}
      {active < steps.length - 1 && (
        <div className="flex justify-end px-6 pb-5">
          <Button
            size="sm"
            onClick={() =>
              setActive((prev) => Math.min(steps.length - 1, prev + 1))
            }
            className="gap-1.5"
          >
            Next Step
            <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  )
}
