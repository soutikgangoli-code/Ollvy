'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MobileBottomCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const howItWorksSection = document.getElementById('how-it-works')
      if (!howItWorksSection) return

      const rect = howItWorksSection.getBoundingClientRect()
      // Show the bar once the HowItWorks section header scrolls past the top of viewport
      setIsVisible(rect.top < 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 lg:hidden transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <Link href="/services" className="block">
        <Button size="lg" className="w-full">
          Book Now
        </Button>
      </Link>
    </div>
  )
}
