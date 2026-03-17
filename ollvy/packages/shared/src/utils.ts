/**
 * Ollvy Shared Utilities
 * From §2 and §3 of ollvy_MASTER_v22.docx
 */

/**
 * Format paisa amount to Indian Rupee string
 * All prices in the database are stored as paisa (1/100 of a rupee)
 * UI format: "Rs X,XXX" (not ₹ symbol per spec §2)
 * @param paisa - Amount in paisa (e.g., 899900 for Rs 8,999)
 * @returns Formatted string (e.g., "Rs 8,999")
 */
export function formatPaisa(paisa: number): string {
  const rupees = paisa / 100;
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
  return `Rs ${formatted}`;
}

/**
 * Calculate GST based on user state vs Ollvy registered state
 * Same state: CGST 9% + SGST 9%
 * Different state: IGST 18%
 * Total is always 18% of basePaisa either way
 *
 * @param basePaisa - Base price in paisa (price_base_paisa)
 * @param userState - User's state (lowercase)
 * @param ollvyState - Ollvy's GST registered state (from OLLVY_GST_STATE env var)
 * @returns Object with cgst, sgst, igst, and total (all in paisa)
 */
export function calculateGST(
  basePaisa: number,
  userState: string,
  ollvyState: string
): {
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
} {
  const isSameState = userState.toLowerCase() === ollvyState.toLowerCase();
  const gstAmount = Math.round(basePaisa * 0.18);

  if (isSameState) {
    // Same state: split into CGST and SGST (9% each)
    const halfGst = Math.round(basePaisa * 0.09);
    return {
      cgst: halfGst,
      sgst: halfGst,
      igst: 0,
      total: halfGst * 2, // Ensures no rounding discrepancy
    };
  } else {
    // Different state: IGST 18%
    return {
      cgst: 0,
      sgst: 0,
      igst: gstAmount,
      total: gstAmount,
    };
  }
}

/**
 * Indian public holidays (fixed dates, update annually)
 * Used for working days calculation
 */
const INDIAN_PUBLIC_HOLIDAYS_2024 = [
  '2024-01-26', // Republic Day
  '2024-03-25', // Holi
  '2024-03-29', // Good Friday
  '2024-04-11', // Eid ul-Fitr (approximate)
  '2024-04-14', // Ambedkar Jayanti
  '2024-04-17', // Ram Navami
  '2024-04-21', // Mahavir Jayanti
  '2024-05-23', // Buddha Purnima
  '2024-06-17', // Eid ul-Adha (approximate)
  '2024-07-17', // Muharram (approximate)
  '2024-08-15', // Independence Day
  '2024-08-26', // Janmashtami
  '2024-09-16', // Milad un-Nabi (approximate)
  '2024-10-02', // Gandhi Jayanti
  '2024-10-12', // Dussehra
  '2024-10-31', // Diwali (Lakshmi Puja)
  '2024-11-01', // Diwali (Govardhan Puja)
  '2024-11-15', // Guru Nanak Jayanti
  '2024-12-25', // Christmas
];

const INDIAN_PUBLIC_HOLIDAYS_2025 = [
  '2025-01-26', // Republic Day
  '2025-03-14', // Holi
  '2025-03-31', // Eid ul-Fitr (approximate)
  '2025-04-14', // Ambedkar Jayanti
  '2025-04-18', // Good Friday
  '2025-05-12', // Buddha Purnima
  '2025-06-07', // Eid ul-Adha (approximate)
  '2025-07-06', // Muharram (approximate)
  '2025-08-15', // Independence Day
  '2025-08-16', // Janmashtami
  '2025-09-05', // Milad un-Nabi (approximate)
  '2025-10-02', // Gandhi Jayanti / Dussehra
  '2025-10-20', // Diwali
  '2025-11-05', // Guru Nanak Jayanti
  '2025-12-25', // Christmas
];

const INDIAN_PUBLIC_HOLIDAYS_2026 = [
  '2026-01-26', // Republic Day
  '2026-03-03', // Holi
  '2026-03-20', // Eid ul-Fitr (approximate)
  '2026-04-03', // Good Friday
  '2026-04-14', // Ambedkar Jayanti
  '2026-05-01', // Buddha Purnima
  '2026-05-27', // Eid ul-Adha (approximate)
  '2026-06-25', // Muharram (approximate)
  '2026-08-15', // Independence Day
  '2026-09-04', // Janmashtami
  '2026-08-25', // Milad un-Nabi (approximate)
  '2026-10-02', // Gandhi Jayanti
  '2026-10-20', // Dussehra
  '2026-11-08', // Diwali
  '2026-11-24', // Guru Nanak Jayanti
  '2026-12-25', // Christmas
];

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Check if a date is a public holiday
 */
function isPublicHoliday(date: Date): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return (
    INDIAN_PUBLIC_HOLIDAYS_2024.includes(dateStr) ||
    INDIAN_PUBLIC_HOLIDAYS_2025.includes(dateStr) ||
    INDIAN_PUBLIC_HOLIDAYS_2026.includes(dateStr)
  );
}

/**
 * Check if a date is a working day (not weekend, not public holiday)
 */
function isWorkingDay(date: Date): boolean {
  return !isWeekend(date) && !isPublicHoliday(date);
}

/**
 * Add working days to a date (excludes weekends + public holidays)
 * Used for SLA calculation (stage_due_date)
 *
 * @param date - Starting date
 * @param days - Number of working days to add
 * @returns New date after adding working days
 */
export function addWorkingDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (isWorkingDay(result)) {
      addedDays++;
    }
  }

  return result;
}

/**
 * Calculate number of working days between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of working days
 */
export function getWorkingDaysBetween(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);

  while (current < endDate) {
    current.setDate(current.getDate() + 1);
    if (isWorkingDay(current)) {
      count++;
    }
  }

  return count;
}
