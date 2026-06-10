import { wrapHTML, ctaButton, mono } from './shared-layout';
import { buildOrderUrl } from '../format';

// Reminder for a paid order that is not yet ready to start: the questionnaire
// and/or documents are still incomplete. Sent at 3, 6, and 9 days after the
// payment date, max 3 times, and stops the moment both are done.
//
// Content adapts to what is still missing:
//   - both pending   -> questionnaire count + document list
//   - questionnaire done, documents pending -> document list only
//   - documents done, questionnaire pending -> questionnaire count only
// Questions are shown as a count of the base total (no per-question labels).
// Documents are listed by name.

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
  input: IncompleteOrderReminderInput
): { subject: string; html: string } {
  const qPending = !input.questionnaire_done;
  const dPending = !input.documents_done;

  let subject: string;
  let middle: string;
  let cta: string;

  if (qPending && dPending) {
    subject = `A quick nudge to finish setting up your ${input.service_name}`;
    middle = `
      <p>Your ${input.service_name} order (placed ${mono(input.paid_at_human)}) is ready to start. We just need two things from you, and your guaranteed delivery date is on hold until they are in.</p>
      <h3>1. Your questionnaire</h3>
      <p>${questionnaireLine(input.remaining_questions, input.total_questions)}.</p>
      <h3>2. Your documents</h3>
      <p>Please upload these:</p>
      ${documentList(input.pending_documents, input.uploaded_documents)}
      <p>It takes about ten minutes. Not got a document handy? Upload what you have and come back for the rest.</p>
    `;
    cta = ctaButton('Finish your setup', buildOrderUrl(input.order_id));
  } else if (!qPending && dPending) {
    subject = `Almost there. Just your documents for ${input.service_name}`;
    middle = `
      <p>Thanks for completing the questionnaire for ${input.service_name}. Last thing we need is your documents, then our team starts straight away. Your guaranteed delivery date is on hold until they are in.</p>
      <h3>Documents still needed</h3>
      ${documentList(input.pending_documents, input.uploaded_documents)}
      <p>Not got a document handy? Upload what you have and come back for the rest.</p>
    `;
    cta = ctaButton('Upload your documents', buildOrderUrl(input.order_id));
  } else {
    subject = `One step left for your ${input.service_name}`;
    middle = `
      <p>Your documents for ${input.service_name} are in, thank you. Last step is the questionnaire, then we get started. Your guaranteed delivery date is on hold until it is done.</p>
      <h3>Your questionnaire</h3>
      <p>${questionnaireLine(input.remaining_questions, input.total_questions)}.</p>
    `;
    cta = ctaButton('Finish the questionnaire', buildOrderUrl(input.order_id));
  }

  const finalNote = input.reminder_number >= 3
    ? `<p style="color: #8a8a8a;">This is our last reminder. Your order stays saved, so pick up whenever you are ready.</p>`
    : '';

  const body = `
    <p>Hi ${input.customer_greeting},</p>
    ${middle}
    <p>To do this: ollvy.com &rarr; Profile &rarr; your order. Everything is right there, or just tap below.</p>
    <p style="margin: 24px 0;">${cta}</p>
    ${finalNote}
    <p style="color: #666;">Stuck on anything? Just reply and our team will help you through it.</p>
    <p>Team Ollvy</p>
  `;

  return { subject, html: wrapHTML(body) };
}
