'use client'

import { useEffect } from 'react'
import { captureAndStoreUTM, captureAndStoreReferral, storeLandingPage } from '@/lib/utm'

/**
 * Attribution Provider
 * Per §23 Connection Points 3 & 9: UTM Attribution + Referral Code
 *
 * Captures UTM params and referral code on first load and stores in sessionStorage.
 * Should be placed in the root layout.
 */
export function UTMProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Capture UTM params, referral code, and landing page on mount
    captureAndStoreUTM()
    captureAndStoreReferral()
    storeLandingPage()
  }, [])

  return <>{children}</>
}
