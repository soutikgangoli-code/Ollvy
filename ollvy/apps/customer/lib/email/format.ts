// Re-exports the canonical Indian-numbering formatPaisa from lib/utils so we
// don't fork the formatting logic between server-rendered pages and emails.

export { formatPaisa } from '@/lib/utils';

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

// "Apr 30, 2026" - IST. Mirrors the Deno helper.
export function formatDateHuman(date: string | Date): string {
  const d = date instanceof Date ? date : new Date(date);
  const ist = new Date(d.getTime() + IST_OFFSET_MS);
  const month = MONTHS_SHORT[ist.getUTCMonth()];
  const day = ist.getUTCDate();
  const year = ist.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

// "2 May 2026, 4:32 PM IST" - for Slack message timestamps. Mirrors Deno helper.
export function formatTimestampIST(date: string | Date): string {
  const d = date instanceof Date ? date : new Date(date);
  const ist = new Date(d.getTime() + IST_OFFSET_MS);
  const day = ist.getUTCDate();
  const month = MONTHS_SHORT[ist.getUTCMonth()];
  const year = ist.getUTCFullYear();
  const hour24 = ist.getUTCHours();
  const minute = ist.getUTCMinutes();
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minStr = minute.toString().padStart(2, '0');
  return `${day} ${month} ${year}, ${hour12}:${minStr} ${period} IST`;
}

export function buildOrderUrl(orderId: string): string {
  return `https://www.ollvy.com/orders/${orderId}`;
}

export function resolveCustomerGreeting(user: {
  business_name?: string | null;
  email?: string | null;
}): string {
  const businessFirst = user.business_name?.split(' ')[0];
  if (businessFirst) return businessFirst;
  const emailLocal = user.email?.split('@')[0];
  if (emailLocal) return emailLocal;
  return 'there';
}
