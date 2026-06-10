// Deno mirror of apps/customer/lib/email/templates/incomplete-order-reminder.ts.
// Kept in sync by hand - if you edit one, edit the other.
//
// Reminder for a paid order that is not yet ready to start: the questionnaire
// and/or documents are still incomplete. Sent at 3, 6, and 9 days after the
// payment date, max 3 times, and stops the moment both are done.

import { wrapHTML, ctaButton, mono } from './shared-layout.ts';
import { buildOrderUrl } from '../format.ts';

export interface IncompleteOrderReminderInput {
  customer_greeting: string;
  service_name: string;
  order_number: string;
  order_id: string;
  paid_at_human: string;
  reminder_number: number; // 1, 2, or 3 (3 = final)
  questionnaire_done: boolean;
  documents_done: boolean;
  total_questions: number;
  remaining_questions: number;
  pending_documents: string[]; // labels still to upload
  uploaded_documents: string[]; // labels already uploaded
}

function documentList(pending: string[], uploaded: string[]): string {
  const items = pending.map((d) => `<li style="margin-bottom: 4px;">${d}</li>`).join('');
  let html = `<ul style="margin: 0 0 14px; padding-left: 20px;">${items}</ul>`;
  if (uploaded.length > 0) {
    html += `<p style="color: #8a8a8a; font-size: 13px;">Already uploaded: ${uploaded.join(', ')}</p>`;
  }
  return html;
}

function questionnaireLine(remaining: number, total: number): string {
  return `${mono(String(remaining))} of ${mono(String(total))} questions still to answer`;
}

export function buildIncompleteOrderReminder(
  input: IncompleteOrderReminderInput,
): { subject: string; html: string } {
  const qPending = !input.questionnaire_done;
  const dPending = !input.documents_done;

  let subject: string;
  let middle: string;
  let cta: string;

  if (qPending && dPending) {
    subject = `A quick nudge to finish setting up your ${input.service_name}`;
    middle = `
      <p>Your order for ${input.service_name} was placed on ${mono(input.paid_at_human)}, and we are ready to start. We just need two things from you first. Until they are in, your guaranteed delivery date stays on hold.</p>
      <h3>1. Your questionnaire</h3>
      <p>${questionnaireLine(input.remaining_questions, input.total_questions)}.</p>
      <h3>2. Your documents</h3>
      <p>Please upload these:</p>
      ${documentList(input.pending_documents, input.uploaded_documents)}
      <p>It takes about ten minutes. If a document is not handy right now, upload what you have and come back for the rest.</p>
    `;
    cta = ctaButton('Finish your setup', buildOrderUrl(input.order_id));
  } else if (!qPending && dPending) {
    subject = `Almost there. Just your documents for ${input.service_name}`;
    middle = `
      <p>Thanks for completing the questionnaire for ${input.service_name}. The last thing we need is your documents, and then our team starts straight away. Your guaranteed delivery date stays on hold until they are in.</p>
      <h3>Documents still needed</h3>
      ${documentList(input.pending_documents, input.uploaded_documents)}
      <p>If a document is not handy right now, upload what you have and come back for the rest.</p>
    `;
    cta = ctaButton('Upload your documents', buildOrderUrl(input.order_id));
  } else {
    subject = `One step left for your ${input.service_name}`;
    middle = `
      <p>Your documents for ${input.service_name} are in, thank you. The last step is the questionnaire, and then we get started. Your guaranteed delivery date stays on hold until it is done.</p>
      <h3>Your questionnaire</h3>
      <p>${questionnaireLine(input.remaining_questions, input.total_questions)}.</p>
    `;
    cta = ctaButton('Finish the questionnaire', buildOrderUrl(input.order_id));
  }

  const finalNote = input.reminder_number >= 3
    ? `<p style="color: #8a8a8a;">This is the last reminder we will send. Your order stays saved, so you can pick up where you left off whenever you are ready.</p>`
    : '';

  const body = `
    <p>Hi ${input.customer_greeting},</p>
    ${middle}
    <p style="margin: 24px 0;">${cta}</p>
    ${finalNote}
    <p style="color: #666;">Stuck on anything? Just reply to this email and a real person will help you through it.</p>
    <p>Team Ollvy</p>
  `;

  return { subject, html: wrapHTML(body) };
}
