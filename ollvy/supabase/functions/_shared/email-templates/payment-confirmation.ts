// Deno mirror of apps/customer/lib/email/templates/payment-confirmation.ts.
// Kept in sync by hand - if you edit one, edit the other.

import { wrapHTML, ctaButton } from './shared-layout.ts';
import { formatPaisa, buildOrderUrl } from '../format.ts';

export interface PaymentConfirmationInput {
  customer_greeting: string;
  service_name: string;
  order_number: string;
  order_id: string;
  base_paisa: number;
  govt_fees_paisa: number;
  gst_paisa: number;
  discount_paisa: number;
  total_paisa: number;
  paid_at_human: string;
  razorpay_payment_id: string;
}

export function buildPaymentConfirmation(
  input: PaymentConfirmationInput,
): { subject: string; html: string } {
  const govtFeesRow = input.govt_fees_paisa > 0
    ? `<tr><td>Government fees:</td><td>${formatPaisa(input.govt_fees_paisa)}</td></tr>`
    : '';
  const discountRow = input.discount_paisa > 0
    ? `<tr><td>Discount:</td><td>-${formatPaisa(input.discount_paisa)}</td></tr>`
    : '';

  const subject = `Order confirmed: ${input.service_name} (${input.order_number})`;

  const body = `
    <p>Hi ${input.customer_greeting},</p>
    <p>Thanks for choosing Ollvy. We've received your payment and your order is confirmed.</p>
    <h3>Order summary</h3>
    <table cellpadding="6" style="border-collapse: collapse;">
      <tr><td>Service:</td><td>${input.service_name}</td></tr>
      <tr><td>Order number:</td><td>${input.order_number}</td></tr>
      <tr><td>Professional fee:</td><td>${formatPaisa(input.base_paisa)}</td></tr>
      ${govtFeesRow}
      <tr><td>GST:</td><td>${formatPaisa(input.gst_paisa)}</td></tr>
      ${discountRow}
      <tr><td><strong>Total paid:</strong></td><td><strong>${formatPaisa(input.total_paisa)}</strong></td></tr>
      <tr><td>Payment date:</td><td>${input.paid_at_human}</td></tr>
      <tr><td>Payment ID:</td><td>${input.razorpay_payment_id}</td></tr>
    </table>
    <h3>What happens next</h3>
    <ol>
      <li>Head to your order page and complete the questionnaire so our team understands your specifics.</li>
      <li>Upload the documents we'll need to file on your behalf. The exact list is on your order page.</li>
      <li>Once both are submitted, our team gets started. Your guaranteed timeline is paused until we have everything from you.</li>
    </ol>
    <p style="margin-top: 24px;">${ctaButton('Continue to your order', buildOrderUrl(input.order_id))}</p>
    <p style="margin-top: 24px; color: #666;">If you have any questions, just reply to this email and we'll get back within a few hours during business days.</p>
    <p>Team Ollvy</p>
  `;

  return { subject, html: wrapHTML(body) };
}
