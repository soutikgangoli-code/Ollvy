/**
 * Pre-cursor utilities for storing pre-payment questionnaire answers
 * Uses sessionStorage to persist answers between eligibility and checkout pages
 * Clears on tab close (sessionStorage behavior)
 * Scoped by serviceSlug to prevent answer bleed between services
 */

const PRE_CURSOR_KEY = 'ollvy_pre_cursor'

export function storePreCursorAnswers(
  serviceSlug: string,
  answers: Record<string, unknown>
): void {
  sessionStorage.setItem(PRE_CURSOR_KEY, JSON.stringify({ serviceSlug, answers }))
}

export function getPreCursorAnswers(
  serviceSlug: string
): Record<string, unknown> | null {
  const stored = sessionStorage.getItem(PRE_CURSOR_KEY)
  if (!stored) return null
  try {
    const data = JSON.parse(stored)
    return data.serviceSlug === serviceSlug ? data.answers : null
  } catch {
    return null
  }
}

export function clearPreCursorAnswers(): void {
  sessionStorage.removeItem(PRE_CURSOR_KEY)
}
