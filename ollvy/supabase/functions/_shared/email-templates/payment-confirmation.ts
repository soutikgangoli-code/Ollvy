// Deno mirror of apps/customer/lib/email/templates/payment-confirmation.ts.
// Kept in sync by hand - if you edit one, edit the other.

import { wrapHTML, ctaButton, mono } from './shared-layout.ts';
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
  guaranteed_date: string;
  documents: string[];
}

const labelTd = 'padding: 4px 16px 4px 0; color: #666; white-space: nowrap; vertical-align: top;';
const valueTd = 'padding: 4px 0; vertical-align: top;';

export function buildPaymentConfirmation(
  input: PaymentConfirmationInput,
): { subject: string; html: string } {
  const govtFeesRow = input.govt_fees_paisa > 0
    ? `<tr><td style="${labelTd}">Government fees</td><td style="${valueTd}">${mono(formatPaisa(input.govt_fees_paisa))}</td></tr>`
    : '';
  const discountRow = input.discount_paisa > 0
    ? `<tr><td style="${labelTd}">Discount</td><td style="${valueTd}">-${mono(formatPaisa(input.discount_paisa))}</td></tr>`
    : '';

  const subject = `Order confirmed: ${input.service_name} (${input.order_number})`;

  const documentsTable = input.documents.length > 0
    ? `<h3>Documents we will need</h3>
    <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
      ${input.documents.map((d) => `<tr><td style="padding: 3px 0;">${d}</td></tr>`).join('')}
    </table>`
    : '';

  const body = `
    <p>Hi ${input.customer_greeting},</p>
    <p>Your payment is in and your order is confirmed. Thanks for choosing Ollvy.</p>
    <h3>Order summary</h3>
    <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
      <tr><td style="${labelTd}">Service</td><td style="${valueTd}">${input.service_name}</td></tr>
      <tr><td style="${labelTd}">Order number</td><td style="${valueTd}">${mono(input.order_number)}</td></tr>
      <tr><td style="${labelTd}">Professional fee</td><td style="${valueTd}">${mono(formatPaisa(input.base_paisa))}</td></tr>
      ${govtFeesRow}
      <tr><td style="${labelTd}">GST</td><td style="${valueTd}">${mono(formatPaisa(input.gst_paisa))}</td></tr>
      ${discountRow}
      <tr><td style="padding: 8px 16px 4px 0; font-weight: 600;">Total paid</td><td style="padding: 8px 0 4px; font-weight: 600;">${mono(formatPaisa(input.total_paisa))}</td></tr>
      <tr><td style="${labelTd}">Payment date</td><td style="${valueTd}">${mono(input.paid_at_human)}</td></tr>
      <tr><td style="${labelTd}">Payment ID</td><td style="${valueTd}">${mono(input.razorpay_payment_id)}</td></tr>
    </table>
    <h3>What happens next</h3>
    <p>Two quick things from your side, then we get to work:</p>
    <ol style="margin: 0 0 14px; padding-left: 20px;">
      <li style="margin-bottom: 6px;">Answer a short questionnaire.</li>
      <li style="margin-bottom: 6px;">Upload the documents we need.</li>
    </ol>
    ${documentsTable}
    <p>Find both on your order page: ollvy.com &rarr; Profile &rarr; your order.</p>
    <p>Your guaranteed date of ${mono(input.guaranteed_date)} starts once both are in.</p>
    <p style="margin: 24px 0;">${ctaButton('Continue to your order', buildOrderUrl(input.order_id))}</p>
    <p style="color: #666;">Got a question? Just reply and our team will get back to you.</p>
    <p>Team Ollvy</p>
  `;

  return { subject, html: wrapHTML(body) };
}
