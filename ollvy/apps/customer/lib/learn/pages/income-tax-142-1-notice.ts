// lib/learn/pages/income-tax-142-1-notice.ts
import { LearnPageConfig } from '../pages';

export const incomeTax1421Notice: LearnPageConfig = {
  slug: 'income-tax-142-1-notice',
  title: 'Income Tax Section 142(1) Notice: What the Department is Asking For',
  seoTitle: 'Income Tax Section 142(1) Notice 2025: How to Respond | Ollvy',
  seoDescription: 'Received an Income Tax Section 142(1) notice? It is either asking you to file a return or produce documents. Understand which situation you are in and how to respond.',
  canonicalUrl: 'https://www.ollvy.com/learn/income-tax-142-1-notice',
  lastReviewed: 'March 2025',
  category: 'Income Tax Notice',
  ctaServiceSlug: 'itr-notice-response',
  relatedServiceSlugs: ['itr-notice-response', 'itr-filing'],
  relatedLearnSlugs: ['income-tax-143-2-scrutiny', 'income-tax-148-148a-reopening', 'income-tax-271-penalty'],
  severity: 'serious',
  deadline: 'Date specified in notice (typically 15-30 days)',
  deadlineNote: 'Not responding to 142(1) is itself an offence and attracts penalty under Section 271(1)(b).',

  sections: [
    {
      number: '01',
      heading: 'SECTION 142(1) IS USED IN TWO VERY DIFFERENT SITUATIONS',
      body: 'A Section 142(1) notice has two entirely distinct purposes under the law and which one applies to you determines what you need to do. Read your notice carefully to identify which situation you are in.',
      bullets: [
        'Situation A - Filing a return: Under Section 142(1)(i), if you have not filed an income tax return and the assessing officer believes you should have, they can ask you to file. This can happen even before the assessment process begins.',
        'Situation B - Producing documents, accounts, or information: Under Section 142(1)(ii) and (iii), during the course of an assessment (usually scrutiny under 143(2)), the officer can ask you to produce specific books of accounts, documents, bank statements, or answer specific questions. This is the more common use.',
      ],
      note: 'Source: Section 142(1), Income Tax Act, 1961.',
    },
    {
      number: '02',
      heading: 'IF THE NOTICE IS ASKING YOU TO FILE A RETURN',
      body: 'File the return for the relevant assessment year as promptly as possible. A few important points:',
      bullets: [
        'If the return is being filed late, Section 234F late fees apply: Rs. 5,000 if income above Rs. 5 lakh; Rs. 1,000 if below.',
        'Interest under Section 234A (1% per month on tax due) applies from the original due date.',
        'The return you file after a 142(1)(i) notice is treated as a belated return.',
        'Do not treat this lightly - not filing even after a 142(1) notice can lead to Best Judgment Assessment under Section 144.',
      ],
    },
    {
      number: '03',
      heading: 'IF THE NOTICE IS ASKING FOR DOCUMENTS OR INFORMATION',
      body: 'This is the more common use and typically arises during a scrutiny assessment. The notice will specify exactly what documents are needed.',
      bullets: [
        'Respond fully and on time: The deadline specified in the notice must be respected. If you need more time, request an extension before the deadline, not after.',
        'Submit only what is asked: Do not send additional documents that were not requested. Unsolicited documents can introduce new questions.',
        'Submit organised documentation: A disorganised submission creates a bad impression and may lead to the officer asking for everything again.',
        'Keep copies of everything you submit: This is your record of what was provided if disputes arise later.',
        'Respond in writing: Even if the notice seems informal, your response should be a written submission with an index of documents attached.',
        'Do not ignore individual items: If the notice asks for 8 things and you can provide 7, provide the 7 and specifically explain in writing why the 8th is not available or not applicable.',
      ],
      note: 'The officer can issue multiple Section 142(1) notices during a scrutiny. Each one must be responded to individually.',
    },
    {
      number: '04',
      heading: 'WHAT HAPPENS IF YOU DO NOT RESPOND',
      body: '',
      bullets: [
        'Penalty under Section 271(1)(b): Rs. 10,000 per notice that you fail to comply with. This is a fixed penalty, not proportional to your income.',
        'Best Judgment Assessment under Section 144: If you repeatedly fail to respond, the officer can pass a best judgment assessment based on available information - typically unfavourable.',
        'Prosecution under Section 276D: Persistent non-compliance with production orders can lead to criminal prosecution.',
      ],
    },
  ],

  faqs: [
    {
      q: 'The 142(1) notice is asking for 5 years of bank statements. That is a lot of documents. Do I really have to produce all of them?',
      a: 'Yes, you must comply with a valid 142(1) notice. However, if the request appears disproportionately broad, you can respond in writing raising this point and requesting that the officer limit the request to what is genuinely relevant to the specific issues under scrutiny. Do this professionally through a CA - it is a legitimate response, not a refusal.',
    },
    {
      q: 'I received a 142(1) notice but I thought my scrutiny was already closed. What is happening?',
      a: 'Sometimes 142(1) notices are issued after earlier responses as follow-up queries. Check whether the case is still open in the faceless assessment system. If the scrutiny was formally concluded and the final 143(3) order was passed, a fresh 142(1) should not be possible unless a new proceeding (like a reassessment under 148) has been initiated.',
    },
  ],
};
