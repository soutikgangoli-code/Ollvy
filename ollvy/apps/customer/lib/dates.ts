import { addBusinessDays, format, isWeekend } from 'date-fns'

// Indian public holidays FY 2025-26 - update annually
const HOLIDAYS: string[] = [
  '2025-08-15',
  '2025-10-02',
  '2025-10-24',
  '2025-11-05',
  '2025-11-14',
  '2025-12-25',
  '2026-01-26',
  '2026-03-29',
  '2026-04-02',
  '2026-04-14',
]

export function getGuaranteedDate(slaDays: number): string | null {
  if (slaDays <= 0) return null

  let date = addBusinessDays(new Date(), slaDays)
  let iterations = 0

  // Skip holidays
  while (HOLIDAYS.includes(format(date, 'yyyy-MM-dd')) || isWeekend(date)) {
    date = addBusinessDays(date, 1)
    if (++iterations > 20) break // safety
  }

  return format(date, 'd MMM') // "25 Mar"
}

export function getNextGstrDueDate(): string {
  const now = new Date()
  const day = now.getDate()
  // GSTR-3B due 20th of following month
  const dueMonth = day <= 15 ? now.getMonth() + 1 : now.getMonth() + 2
  const dueDate = new Date(now.getFullYear(), dueMonth, 20)
  return format(dueDate, 'd MMM')
}
