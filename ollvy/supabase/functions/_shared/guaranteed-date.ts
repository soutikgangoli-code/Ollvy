// Deno port of apps/customer/lib/dates.ts getGuaranteedDate / getCompletionEstimate.
// Kept in sync by hand - if you edit the SLA/holiday logic here, edit the lib too.
//
// Computed at SEND time so the submission-complete email's "Guaranteed by"
// line matches the date badge the customer saw on the site. No date-fns in the
// edge runtime, so the date-fns helpers (addBusinessDays / addDays / isWeekend /
// format) are reimplemented here as pure UTC arithmetic.
//
// All calendar math runs in IST (UTC+5:30, no DST) so "today" and the holiday
// comparison line up with the Indian working calendar the site uses.

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Mirror of apps/customer/lib/dates.ts HOLIDAYS. Update annually in April.
export const HOLIDAYS: string[] = [
  // FY 2025-26 (Apr 2025 - Mar 2026) - past, kept for historical SLA
  '2025-08-15', // Independence Day
  '2025-10-02', // Gandhi Jayanti
  '2025-10-24', // Dussehra (tentative - was per 2025 gazette)
  '2025-11-05', // Diwali (tentative)
  '2025-11-14', // Guru Nanak Jayanti
  '2025-12-25', // Christmas
  '2026-01-26', // Republic Day
  '2026-03-04', // Holi
  '2026-03-21', // Id-ul-Fitr (tentative, subject to moon sighting)
  '2026-03-26', // Rama Navami
  '2026-03-31', // Mahavir Jayanti
  // FY 2026-27 (Apr 2026 - Mar 2027) - 17 gazetted holidays per DoPT
  '2026-04-03', // Good Friday
  '2026-04-14', // Dr. Ambedkar Jayanti
  '2026-05-01', // Buddha Purnima
  '2026-05-27', // Id-ul-Zuha / Bakrid (tentative)
  '2026-06-26', // Muharram (tentative)
  '2026-08-15', // Independence Day (Saturday)
  '2026-08-26', // Id-e-Milad / Milad-un-Nabi (tentative)
  '2026-09-04', // Janmashtami
  '2026-10-02', // Mahatma Gandhi Jayanti
  '2026-10-20', // Dussehra
  '2026-11-08', // Diwali (Sunday)
  '2026-11-24', // Guru Nanak Jayanti
  '2026-12-25', // Christmas
  '2027-01-26', // Republic Day
  '2027-03-22', // Holi
  '2027-03-26', // Good Friday
];

// Represent a working date as a pure IST calendar day (midnight IST), so
// weekend / holiday checks never get tripped up by the time-of-day component.
function istToday(): Date {
  const nowIst = new Date(Date.now() + IST_OFFSET_MS);
  return new Date(Date.UTC(
    nowIst.getUTCFullYear(),
    nowIst.getUTCMonth(),
    nowIst.getUTCDate(),
  ));
}

function addCalendarDays(date: Date, days: number): Date {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function isWeekend(date: Date): boolean {
  const day = date.getUTCDay(); // 0 = Sun, 6 = Sat
  return day === 0 || day === 6;
}

// "yyyy-MM-dd" for a midnight-UTC working date (matches HOLIDAYS entries).
function isoDay(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Mirrors date-fns addBusinessDays: advance `count` working days (skip
// weekends), starting the day after `date`. Does NOT skip holidays - the
// callers below handle holidays exactly like lib/dates.ts does.
function addBusinessDays(date: Date, count: number): Date {
  let result = new Date(date.getTime());
  let remaining = Math.abs(count);
  const step = count < 0 ? -1 : 1;
  while (remaining > 0) {
    result = addCalendarDays(result, step);
    if (!isWeekend(result)) remaining--;
  }
  return result;
}

// "25 Mar"
function formatDayMonth(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]}`;
}

// "September 2027"
function formatMonthYear(date: Date): string {
  return `${MONTHS_LONG[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function getGuaranteedDate(slaDays: number): string | null {
  if (slaDays <= 0) return null;

  let date = addBusinessDays(istToday(), slaDays);
  let iterations = 0;

  while (HOLIDAYS.includes(isoDay(date)) || isWeekend(date)) {
    date = addBusinessDays(date, 1);
    if (++iterations > 20) break; // safety
  }

  return formatDayMonth(date);
}

export interface CompletionEstimate {
  guaranteedDate: string;
  hasGovtProcessing: boolean;
  govtDisclaimer?: string;
}

// Port of lib/dates.ts getCompletionEstimate. Returns the badge-format
// guaranteed date ("d MMM", or "MMMM yyyy" for govt cases over 60 days).
export function getCompletionEstimate(
  slaDays: number,
  hasGovtProcessing: boolean,
  completionMaxDays: number | null | undefined,
  completionRangeText: string | null | undefined,
): CompletionEstimate | null {
  if (hasGovtProcessing && completionMaxDays && completionRangeText) {
    let date: Date;
    let formattedDate: string;

    if (completionMaxDays > 60) {
      // Calendar days for long government processes -> "Month Year".
      date = addCalendarDays(istToday(), completionMaxDays);
      formattedDate = formatMonthYear(date);
    } else {
      // Business days for shorter processes -> "Day Month".
      date = addBusinessDays(istToday(), completionMaxDays);
      let iterations = 0;
      while ((HOLIDAYS.includes(isoDay(date)) || isWeekend(date)) && iterations < 20) {
        date = addBusinessDays(date, 1);
        iterations++;
      }
      formattedDate = formatDayMonth(date);
    }

    return {
      guaranteedDate: formattedDate,
      hasGovtProcessing: true,
      govtDisclaimer: `Includes ${completionRangeText} govt processing`,
    };
  }

  if (slaDays > 0) {
    const date = getGuaranteedDate(slaDays);
    if (date) {
      return {
        guaranteedDate: date,
        hasGovtProcessing: false,
      };
    }
  }

  return null;
}
