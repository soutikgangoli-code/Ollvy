import { wrapHTML, ctaButton } from './shared-layout';
import { formatPaisa, buildOrderUrl } from '../format';

export interface OrderCompletedInput {
  customer_greeting: string;
  service_name: string;
  order_number: string;
  order_id: string;
  completed_at_human: string;
  total_paisa: number;
}

export function buildOrderCompleted(
  input: OrderCompletedInput
): { subject: string; html: string } {
  const subject = `Done. Your ${input.service_name} is complete (${input.order_number})`;

  // TODO: Replace with real GBP review link
  const reviewUrl = 'https://g.page/r/REPLACE_WITH_GBP_REVIEW_LINK_TODO';

  const body = `
    <p>Hi ${input.customer_greeting},</p>
    <p>Your ${input.service_name} is complete. Thank you for trusting us with this.</p>
    <h3>Order summary</h3>
    <table cellpadding="6">
      <tr><td>Service:</td><td>${input.service_name}</td></tr>
      <tr><td>Order number:</td><td>${input.order_number}</td></tr>
      <tr><td>Completed on:</td><td>${input.completed_at_human}</td></tr>
      <tr><td>Total paid:</td><td>${formatPaisa(input.total_paisa)}</td></tr>
    </table>
    <h3>Your final documents</h3>
    <p>All deliverables are on your order page, ready to download. We recommend saving them somewhere safe like a Google Drive folder or password manager.</p>
    <p style="margin-top: 24px;">${ctaButton('View and download your documents', buildOrderUrl(input.order_id))}</p>
    <h3>A small ask</h3>
    <p>If we did right by you, would you mind leaving us a Google review? It takes 30 seconds and genuinely helps other founders find us.</p>
    <p style="margin-top: 16px;">${ctaButton('Leave a Google review', reviewUrl)}</p>
    <p>Or if anything didn't go perfectly, reply to this email and let me know directly. We'll make it right.</p>
    <p>Soutik<br/>Founder, Ollvy</p>
  `;

  return { subject, html: wrapHTML(body) };
}
