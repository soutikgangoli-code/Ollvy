// Deno mirror of apps/customer/lib/email/templates/admin-update.ts.
// Kept in sync by hand - if you edit one, edit the other.

import { wrapHTML, ctaButton } from './shared-layout.ts';
import { buildOrderUrl } from '../format.ts';

export interface AdminUpdateInput {
  customer_greeting: string;
  service_name: string;
  order_number: string;
  order_id: string;
}

export function buildAdminUpdate(
  input: AdminUpdateInput,
): { subject: string; html: string } {
  const subject = `Update on your ${input.service_name} order (${input.order_number})`;

  const body = `
    <p>Hi ${input.customer_greeting},</p>
    <p>There's been some movement on your ${input.service_name} order (${input.order_number}). Our team has made an update that needs your attention or is worth checking.</p>
    <h3>Order details</h3>
    <table cellpadding="6">
      <tr><td>Service:</td><td>${input.service_name}</td></tr>
      <tr><td>Order number:</td><td>${input.order_number}</td></tr>
    </table>
    <p>Head to your order page to see what's new. If anything needs action from your side, you'll see it clearly there.</p>
    <p style="margin-top: 24px;">${ctaButton('View your order', buildOrderUrl(input.order_id))}</p>
    <p>Team Ollvy</p>
  `;

  return { subject, html: wrapHTML(body) };
}
