'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StickyToolCTAProps {
  buttonText: string
  buttonHref: string
  triggerId?: string // Show sticky after this element is scrolled past
  showScrollTop?: boolean // Show a "go to top" button alongside CTA
  scrollTopTargetId?: string // Element to scroll to when "go to top" is clicked
}

export function StickyToolCTA({ buttonText, buttonHref, triggerId, showScrollTop, scrollTopTargetId }: StickyToolCTAProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (triggerId) {
        const trigger = document.getElementById(triggerId)
        if (trigger) {
          const rect = trigger.getBoundingClientRect()
          setIsVisible(rect.bottom < 0)
          return
        }
      }
      // Fallback: show after scrolling past 60% of viewport
      setIsVisible(window.scrollY > window.innerHeight * 0.6)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [triggerId])

  const handleScrollTop = () => {
    const target = scrollTopTargetId ? document.getElementById(scrollTopTargetId) : null
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-3 lg:hidden transition-transform duration-150',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center gap-2">
        {showScrollTop && (
          <button
            onClick={handleScrollTop}
            className="shrink-0 w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        <Link href={buttonHref} prefetch={true} className="block flex-1">
          <Button size="lg" className="w-full">
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  )
}
