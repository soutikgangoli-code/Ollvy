import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// All formatters below are deterministic across server (Node ICU) and client
// (browser ICU). The previous Intl.* implementations emitted different
// whitespace characters between Node and Chrome for INR currency
// (regular space vs U+00A0 vs U+202F) and minor date-format variations,
// which caused React error #418 "Text content does not match server-rendered
// HTML" on every page that rendered an OrderCard.

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Indian number grouping: lakh (last 3 digits, then comma every 2 digits).
// e.g. 1234567 → "12,34,567"
function formatIndianNumber(n: number): string {
  const negative = n < 0
  const str = String(Math.abs(Math.floor(n)))
  if (str.length <= 3) return (negative ? '-' : '') + str
  const lastThree = str.slice(-3)
  const otherDigits = str.slice(0, -3)
  const grouped = otherDigits.replace(/(\d)(?=(\d\d)+$)/g, '$1,')
  return (negative ? '-' : '') + grouped + ',' + lastThree
}

// Always renders dates as UTC-based "9 Apr 2026" (matches the date portion
// of the stored ISO string, no timezone drift between server and client).
function getDateParts(date: string | Date): { day: number; month: number; year: number; hour: number; minute: number } {
  // For ISO date-only strings (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS...), parse directly
  // to avoid timezone normalization differences.
  if (typeof date === 'string') {
    const m = date.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/)
    if (m) {
      return {
        year: parseInt(m[1], 10),
        month: parseInt(m[2], 10),
        day: parseInt(m[3], 10),
        hour: m[4] ? parseInt(m[4], 10) : 0,
        minute: m[5] ? parseInt(m[5], 10) : 0,
      }
    }
  }
  const d = date instanceof Date ? date : new Date(date)
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
  }
}

export function formatPaisa(paisa: number): string {
  return '₹' + formatIndianNumber(paisa / 100)
}

export function formatDate(date: string | Date): string {
  const { day, month, year } = getDateParts(date)
  return `${day} ${MONTHS_SHORT[month - 1]} ${year}`
}

export function formatDateTime(date: string | Date): string {
  const { day, month, year, hour, minute } = getDateParts(date)
  const period = hour >= 12 ? 'pm' : 'am'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const minStr = minute.toString().padStart(2, '0')
  return `${day} ${MONTHS_SHORT[month - 1]} ${year}, ${hour12}:${minStr} ${period}`
}

export function formatTime(date: string | Date): string {
  const { hour, minute } = getDateParts(date)
  const period = hour >= 12 ? 'pm' : 'am'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const minStr = minute.toString().padStart(2, '0')
  return `${hour12}:${minStr} ${period}`
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function addWorkingDays(date: Date, days: number): Date {
  const result = new Date(date)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const dayOfWeek = result.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++
    }
  }
  return result
}
