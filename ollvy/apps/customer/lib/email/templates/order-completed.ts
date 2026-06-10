import { wrapHTML, ctaButton, mono } from './shared-layout';
import { formatPaisa, buildOrderUrl } from '../format';

export interface OrderCompletedInput {
  customer_greeting: string;
  service_name: string;
  order_number: string;
  order_id: string;
  completed_at_human: string;
  total_paisa: number;
}

const labelTd = 'padding: 4px 16px 4px 0; color: #666; white-space: nowrap; vertical-align: top;';
const valueTd = 'padding: 4px 0; vertical-align: top;';

export function buildOrderCompleted(
  input: OrderCompletedInput
): { subject: string; html: string } {
  const subject = `It is done. Your ${input.service_name} is complete (${input.order_number})`;

  const body = `
    <p>Hi ${input.customer_greeting},</p>
    <p>Your ${input.service_name} is complete. Thank you for trusting Ollvy with it.</p>
    <h3>Order summary</h3>
    <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
      <tr><td style="${labelTd}">Service</td><td style="${valueTd}">${input.service_name}</td></tr>
      <tr><td style="${labelTd}">Order number</td><td style="${valueTd}">${mono(input.order_number)}</td></tr>
      <tr><td style="${labelTd}">Completed on</td><td style="${valueTd}">${mono(input.completed_at_human)}</td></tr>
      <tr><td style="${labelTd}">Total paid</td><td style="${valueTd}">${mono(formatPaisa(input.total_paisa))}</td></tr>
    </table>
    <h3>Your documents</h3>
    <p>Every deliverable is on your order page, ready to download. It is worth saving them somewhere safe so they are easy to find later.</p>
    <p style="margin: 24px 0;">${ctaButton('View and download your documents', buildOrderUrl(input.order_id))}</p>
    <p>And if any part of this did not go the way you hoped, reply to this email and tell me directly. I will make it right.</p>
    <p>Soutik<br>Founder, Ollvy</p>
  `;

  return { subject, html: wrapHTML(body) };
}
