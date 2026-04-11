'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StickyToolCTAProps {
  buttonText: string
  buttonHref: string
}

export function StickyToolCTA({ buttonText, buttonHref }: StickyToolCTAProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 40% of the page
      setIsVisible(window.scrollY > window.innerHeight * 0.4)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 lg:hidden transition-transform duration-150',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <Link href={buttonHref} prefetch={true} className="block">
        <Button size="lg" className="w-full">
          {buttonText}
        </Button>
      </Link>
    </div>
  )
}
