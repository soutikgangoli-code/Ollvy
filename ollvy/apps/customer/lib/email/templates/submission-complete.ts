import { wrapHTML, ctaButton } from './shared-layout';
import { buildOrderUrl } from '../format';

export interface SubmissionCompleteInput {
  customer_greeting: string;
  service_name: string;
  order_number: string;
  order_id: string;
  submitted_at_human: string;
}

export function buildSubmissionComplete(
  input: SubmissionCompleteInput
): { subject: string; html: string } {
  const subject = `Got it. Starting work on your ${input.service_name} (${input.order_number})`;

  const body = `
    <p>Hi ${input.customer_greeting},</p>
    <p>Thanks for completing the questionnaire and uploading your documents for ${input.service_name}.</p>
    <p>Our team has everything needed to start work. Your guaranteed timeline is now active. Check your order page for the exact delivery date.</p>
    <h3>Order details</h3>
    <table cellpadding="6">
      <tr><td>Service:</td><td>${input.service_name}</td></tr>
      <tr><td>Order number:</td><td>${input.order_number}</td></tr>
      <tr><td>Submitted on:</td><td>${input.submitted_at_human}</td></tr>
    </table>
    <h3>What to expect</h3>
    <p>A member of our team will review your details and may come back with follow-up questions or additional documents if needed. You'll get an email each time there's something for you to check. Otherwise, sit tight. We'll keep you updated as the order progresses.</p>
    <p style="margin-top: 24px;">${ctaButton('View your order', buildOrderUrl(input.order_id))}</p>
    <p>Team Ollvy</p>
  `;

  return { subject, html: wrapHTML(body) };
}
