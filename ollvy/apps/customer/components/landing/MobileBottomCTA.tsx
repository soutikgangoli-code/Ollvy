'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MobileBottomCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const productShowcase = document.getElementById('product-showcase')
      if (!productShowcase) {
        // Fallback: show after scrolling past half the viewport
        setIsVisible(window.scrollY > window.innerHeight * 0.5)
        return
      }

      const rect = productShowcase.getBoundingClientRect()
      // Show the bar once the ProductShowcase section starts entering viewport
      setIsVisible(rect.top < window.innerHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 lg:hidden transition-transform duration-150",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <Link href="/services" prefetch={true} className="block">
        <Button size="lg" className="w-full">
          Book Now
        </Button>
      </Link>
    </div>
  )
}
