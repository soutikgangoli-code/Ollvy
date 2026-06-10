import { wrapHTML, ctaButton, mono } from './shared-layout';
import { buildOrderUrl } from '../format';

export interface AdminUpdateInput {
  customer_greeting: string;
  service_name: string;
  order_number: string;
  order_id: string;
  update_date_human: string;
  // Human lines describing what changed, e.g. "We have added a few questions for you."
  updates: string[];
}

const labelTd = 'padding: 4px 16px 4px 0; color: #666; white-space: nowrap; vertical-align: top;';
const valueTd = 'padding: 4px 0; vertical-align: top;';

export function buildAdminUpdate(
  input: AdminUpdateInput
): { subject: string; html: string } {
  const subject = `An update on your ${input.service_name} order (${input.order_number})`;

  const updatesList = `<ul style="margin: 0 0 14px; padding-left: 20px;">${input.updates.map((u) => `<li style="margin-bottom: 4px;">${u}</li>`).join('')}</ul>`;

  const body = `
    <p>Hi ${input.customer_greeting},</p>
    <p>There is an update on your ${input.service_name} order:</p>
    ${updatesList}
    <h3>Order details</h3>
    <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
      <tr><td style="${labelTd}">Service</td><td style="${valueTd}">${input.service_name}</td></tr>
      <tr><td style="${labelTd}">Order number</td><td style="${valueTd}">${mono(input.order_number)}</td></tr>
      <tr><td style="${labelTd}">Update posted</td><td style="${valueTd}">${mono(input.update_date_human)}</td></tr>
    </table>
    <p>Take a look on your order page and pick up from there.</p>
    <p style="margin: 24px 0;">${ctaButton('View your order', buildOrderUrl(input.order_id))}</p>
    <p>Team Ollvy</p>
  `;

  return { subject, html: wrapHTML(body) };
}
