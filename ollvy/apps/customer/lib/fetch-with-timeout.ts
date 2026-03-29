/**
 * Fetch with timeout utility
 * Wraps fetch with an AbortController to enforce timeouts on network requests
 */

export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number // Timeout in milliseconds
}

const DEFAULT_TIMEOUT = 30000 // 30 seconds

export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    return response
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Default timeouts for different operation types
 */
export const TIMEOUTS = {
  OTP: 15000,        // 15 seconds for OTP operations
  PAYMENT: 60000,    // 60 seconds for payment operations
  UPLOAD: 120000,    // 2 minutes for file uploads
  DEFAULT: 30000,    // 30 seconds for general API calls
} as const
