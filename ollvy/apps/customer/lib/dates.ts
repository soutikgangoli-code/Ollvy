import { addBusinessDays, format, isWeekend } from 'date-fns'

// Indian public holidays FY 2025-26 - update annually
export const HOLIDAYS: string[] = [
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

export interface ProjectedStage {
  stageName: string
  dateRange: string
  description?: string
  isGovtWait: boolean
  isCompletion: boolean
  dayStart: number
  dayEnd: number
}

export interface WorkflowStageInput {
  stage_key: string
  stage_name: string
  sla_working_days: number
  wait_for_govt: boolean
}

/**
 * Calculate projected timeline with dates for each workflow stage
 */
export function getProjectedTimeline(
  stages: WorkflowStageInput[],
  startDate: Date = new Date()
): ProjectedStage[] {
  if (!stages || stages.length === 0) return []

  // Validate startDate
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    startDate = new Date()
  }

  const result: ProjectedStage[] = []
  let cumulativeDays = 0

  stages.forEach((stage, index) => {
    // Validate sla_working_days
    const slaDays = typeof stage.sla_working_days === 'number' && !isNaN(stage.sla_working_days)
      ? stage.sla_working_days
      : 1

    const dayStart = cumulativeDays
    const dayEnd = cumulativeDays + slaDays

    try {
      // Calculate actual dates
      let startDateCalc = dayStart === 0 ? new Date(startDate) : addBusinessDays(startDate, dayStart)
      let endDateCalc = addBusinessDays(startDate, dayEnd)

      // Validate calculated dates
      if (isNaN(startDateCalc.getTime()) || isNaN(endDateCalc.getTime())) {
        throw new Error('Invalid date calculation')
      }

      // Skip holidays for start date
      let iterations = 0
      while ((HOLIDAYS.includes(format(startDateCalc, 'yyyy-MM-dd')) || isWeekend(startDateCalc)) && iterations < 20) {
        startDateCalc = addBusinessDays(startDateCalc, 1)
        iterations++
      }

      // Skip holidays for end date
      iterations = 0
      while ((HOLIDAYS.includes(format(endDateCalc, 'yyyy-MM-dd')) || isWeekend(endDateCalc)) && iterations < 20) {
        endDateCalc = addBusinessDays(endDateCalc, 1)
        iterations++
      }

      // Format date range
      let dateRange: string
      if (slaDays <= 1) {
        dateRange = format(startDateCalc, 'MMMM do')
      } else {
        const startMonth = format(startDateCalc, 'MMMM')
        const endMonth = format(endDateCalc, 'MMMM')
        if (startMonth === endMonth) {
          dateRange = `${startMonth} ${format(startDateCalc, 'do')}-${format(endDateCalc, 'do')}`
        } else {
          dateRange = `${format(startDateCalc, 'MMMM do')} - ${format(endDateCalc, 'MMMM do')}`
        }
      }

      const isCompletion = index === stages.length - 1

      result.push({
        stageName: stage.stage_name || 'Processing',
        dateRange,
        isGovtWait: Boolean(stage.wait_for_govt),
        isCompletion,
        dayStart,
        dayEnd,
      })

      cumulativeDays = dayEnd
    } catch (err) {
      // Skip this stage if date calculation fails
      console.error('Failed to calculate date for stage:', stage, err)
      cumulativeDays += slaDays
    }
  })

  return result
}

/**
 * Get the guaranteed completion date for a service
 * Adds a 7-day buffer to the SLA for safety
 */
export function getCompletionDate(slaDays: number, startDate: Date = new Date(), bufferDays: number = 7): string {
  // Validate inputs
  if (typeof slaDays !== 'number' || isNaN(slaDays) || slaDays <= 0) return ''

  // Validate startDate
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    startDate = new Date()
  }

  try {
    const totalDays = slaDays + bufferDays
    let date = addBusinessDays(startDate, totalDays)
    let iterations = 0

    // Skip holidays
    while ((HOLIDAYS.includes(format(date, 'yyyy-MM-dd')) || isWeekend(date)) && iterations < 20) {
      date = addBusinessDays(date, 1)
      iterations++
    }

    return format(date, 'MMMM do')
  } catch (err) {
    console.error('Failed to calculate completion date:', err)
    return ''
  }
}
