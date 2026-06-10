import { wrapHTML, ctaButton, mono } from './shared-layout';
import { buildOrderUrl } from '../format';

export interface AdminUpdateInput {
  customer_greeting: string;
  service_name: string;
  order_number: string;
  order_id: string;
  update_date_human: string;
}

const labelTd = 'padding: 4px 16px 4px 0; color: #666; white-space: nowrap; vertical-align: top;';
const valueTd = 'padding: 4px 0; vertical-align: top;';

export function buildAdminUpdate(
  input: AdminUpdateInput
): { subject: string; html: string } {
  const subject = `An update on your ${input.service_name} order (${input.order_number})`;

  const body = `
    <p>Hi ${input.customer_greeting},</p>
    <p>There is a new update on your ${input.service_name} order from our team. It is worth a look, and there may be something for you to action.</p>
    <h3>Order details</h3>
    <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
      <tr><td style="${labelTd}">Service</td><td style="${valueTd}">${input.service_name}</td></tr>
      <tr><td style="${labelTd}">Order number</td><td style="${valueTd}">${mono(input.order_number)}</td></tr>
      <tr><td style="${labelTd}">Update posted</td><td style="${valueTd}">${mono(input.update_date_human)}</td></tr>
    </table>
    <p>Open your order page to see what is new. If we need anything from you, it will be marked clearly there.</p>
    <p style="margin: 24px 0;">${ctaButton('View your order', buildOrderUrl(input.order_id))}</p>
    <p>Team Ollvy</p>
  `;

  return { subject, html: wrapHTML(body) };
}
