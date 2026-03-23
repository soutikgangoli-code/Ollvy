/**
 * Safe URL parameter parsing utilities
 * Prevents NaN values when URL params contain invalid data
 */

/**
 * Safely parse an integer from a URL parameter value.
 * Returns the default value if parsing fails or produces NaN.
 *
 * @param value - The string value to parse (may be null or invalid)
 * @param defaultValue - The fallback value if parsing fails
 * @returns A valid integer, never NaN
 */
export function safeParseInt(
  value: string | null,
  defaultValue: number
): number {
  if (value === null || value === '') return defaultValue
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? defaultValue : parsed
}
