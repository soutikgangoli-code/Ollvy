/**
 * UTM Capture & Persistence
 * Per §23 Connection Point 3: UTM Attribution
 *
 * Captures UTM params from URL on first load and persists in sessionStorage.
 * Retrieved at checkout and attached to order creation.
 */

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

const UTM_STORAGE_KEY = 'ollvy_utm_params'

/**
 * Capture UTM params from URL search params
 */
export function captureUTMFromURL(searchParams: URLSearchParams): UTMParams | null {
  const utmParams: UTMParams = {}
  let hasAny = false

  const utmKeys: (keyof UTMParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ]

  for (const key of utmKeys) {
    const value = searchParams.get(key)
    if (value) {
      utmParams[key] = value
      hasAny = true
    }
  }

  return hasAny ? utmParams : null
}

/**
 * Store UTM params in sessionStorage
 * Only stores if UTM params exist (first-touch attribution)
 */
export function storeUTMParams(params: UTMParams): void {
  if (typeof window === 'undefined') return

  // Only store first touch - don't overwrite if already set
  const existing = sessionStorage.getItem(UTM_STORAGE_KEY)
  if (existing) return

  sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params))
}

/**
 * Get stored UTM params from sessionStorage
 */
export function getStoredUTMParams(): UTMParams | null {
  if (typeof window === 'undefined') return null

  const stored = sessionStorage.getItem(UTM_STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as UTMParams
  } catch {
    return null
  }
}

/**
 * Clear stored UTM params (e.g., after successful checkout)
 */
export function clearUTMParams(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(UTM_STORAGE_KEY)
}

/**
 * Capture UTM from current URL and store if present
 * Call this on app initialization or page load
 */
export function captureAndStoreUTM(): void {
  if (typeof window === 'undefined') return

  const searchParams = new URLSearchParams(window.location.search)
  const utmParams = captureUTMFromURL(searchParams)

  if (utmParams) {
    storeUTMParams(utmParams)
  }
}

/**
 * Get attribution data for order creation
 * Returns UTM params + page path for analytics
 */
export function getAttributionData(): {
  utm: UTMParams | null
  landingPage: string | null
} {
  const utm = getStoredUTMParams()
  const landingPage = typeof window !== 'undefined'
    ? sessionStorage.getItem('ollvy_landing_page')
    : null

  return { utm, landingPage }
}

/**
 * Store landing page path on first visit
 */
export function storeLandingPage(): void {
  if (typeof window === 'undefined') return

  const existing = sessionStorage.getItem('ollvy_landing_page')
  if (existing) return

  sessionStorage.setItem('ollvy_landing_page', window.location.pathname)
}

/**
 * Referral Code Handling
 * Per §23 Connection Point 9: Referral Code
 *
 * Captures `ref` param from URL and stores in sessionStorage.
 * Retrieved at checkout and linked to referrer's user account.
 */

const REFERRAL_STORAGE_KEY = 'ollvy_referral_code'

/**
 * Capture referral code from URL
 */
export function captureReferralCode(searchParams: URLSearchParams): string | null {
  return searchParams.get('ref')
}

/**
 * Store referral code in sessionStorage (first-touch only)
 */
export function storeReferralCode(code: string): void {
  if (typeof window === 'undefined') return

  // Only store first referral - don't overwrite
  const existing = sessionStorage.getItem(REFERRAL_STORAGE_KEY)
  if (existing) return

  sessionStorage.setItem(REFERRAL_STORAGE_KEY, code)
}

/**
 * Get stored referral code from sessionStorage
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(REFERRAL_STORAGE_KEY)
}

/**
 * Clear stored referral code (e.g., after successful checkout)
 */
export function clearReferralCode(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(REFERRAL_STORAGE_KEY)
}

/**
 * Capture referral code from current URL and store if present
 */
export function captureAndStoreReferral(): void {
  if (typeof window === 'undefined') return

  const searchParams = new URLSearchParams(window.location.search)
  const refCode = captureReferralCode(searchParams)

  if (refCode) {
    storeReferralCode(refCode)
  }
}

/**
 * Google Click Identifier (gclid / gbraid / wbraid) Capture & Persistence
 *
 * Forward-looking plumbing for server-side (offline) Google Ads conversion
 * import. Captures the first click id seen on landing and persists it (with a
 * timestamp) in sessionStorage, using the same first-touch mechanism as UTM.
 * Retrieved at checkout and written onto the order at creation.
 *
 * `gclid` is the standard web click id. `gbraid` / `wbraid` are the
 * iOS/privacy-safe variants Google sends instead of gclid. We store whichever
 * is present first; the matched param name is kept alongside the value so a
 * later offline-import job can route it to the correct Google Ads field.
 */

const GCLID_STORAGE_KEY = 'ollvy_google_click_id'

export type GoogleClickParam = 'gclid' | 'gbraid' | 'wbraid'

export interface StoredGoogleClickId {
  value: string
  param: GoogleClickParam
  capturedAt: string // ISO timestamp
}

/**
 * Read the first Google click id present in the URL (gclid, then gbraid, then wbraid)
 */
export function captureGclidFromURL(
  searchParams: URLSearchParams
): { value: string; param: GoogleClickParam } | null {
  const params: GoogleClickParam[] = ['gclid', 'gbraid', 'wbraid']
  for (const param of params) {
    const value = searchParams.get(param)
    if (value) return { value, param }
  }
  return null
}

/**
 * Store the click id in sessionStorage (first-touch only - never overwrite)
 */
export function storeGclid(found: { value: string; param: GoogleClickParam }): void {
  if (typeof window === 'undefined') return

  const existing = sessionStorage.getItem(GCLID_STORAGE_KEY)
  if (existing) return

  const record: StoredGoogleClickId = {
    value: found.value,
    param: found.param,
    capturedAt: new Date().toISOString(),
  }
  sessionStorage.setItem(GCLID_STORAGE_KEY, JSON.stringify(record))
}

/**
 * Get the stored click id value (the raw gclid/gbraid/wbraid string), or null
 */
export function getStoredGclid(): string | null {
  if (typeof window === 'undefined') return null

  const stored = sessionStorage.getItem(GCLID_STORAGE_KEY)
  if (!stored) return null

  try {
    return (JSON.parse(stored) as StoredGoogleClickId).value
  } catch {
    return null
  }
}

/**
 * Get the matched param name of the stored click id (gclid / gbraid / wbraid), or null.
 * Used so the offline-import job can route each id to the correct Google Ads field.
 */
export function getStoredGclidSource(): GoogleClickParam | null {
  if (typeof window === 'undefined') return null

  const stored = sessionStorage.getItem(GCLID_STORAGE_KEY)
  if (!stored) return null

  try {
    return (JSON.parse(stored) as StoredGoogleClickId).param
  } catch {
    return null
  }
}

/**
 * Clear the stored click id (e.g., after successful checkout)
 */
export function clearGclid(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(GCLID_STORAGE_KEY)
}

/**
 * Capture the click id from the current URL and store if present
 */
export function captureAndStoreGclid(): void {
  if (typeof window === 'undefined') return

  const searchParams = new URLSearchParams(window.location.search)
  const found = captureGclidFromURL(searchParams)

  if (found) {
    storeGclid(found)
  }
}

/**
 * Get all attribution data for order creation
 * Returns UTM params, referral code, landing page, and Google click id
 */
export function getFullAttributionData(): {
  utm: UTMParams | null
  referralCode: string | null
  landingPage: string | null
  gclid: string | null
  gclidSource: GoogleClickParam | null
} {
  const utm = getStoredUTMParams()
  const referralCode = getStoredReferralCode()
  const landingPage = typeof window !== 'undefined'
    ? sessionStorage.getItem('ollvy_landing_page')
    : null

  return {
    utm,
    referralCode,
    landingPage,
    gclid: getStoredGclid(),
    gclidSource: getStoredGclidSource(),
  }
}

/**
 * Clear all attribution data after successful checkout
 */
export function clearAllAttributionData(): void {
  clearUTMParams()
  clearReferralCode()
  clearGclid()
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('ollvy_landing_page')
  }
}
