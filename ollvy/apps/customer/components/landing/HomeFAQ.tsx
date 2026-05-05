'use client'

import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { FAQServicePrices } from '@/lib/data/services'
import { usePostHogEvents } from '@/lib/hooks/usePostHogEvents'

// Show all FAQs on homepage

function getFaqData(prices: FAQServicePrices) {
  return [
  {
    id: 'q1',
    question: 'What is the difference between an LLP and a Private Limited Company in India?',
    answer: (
      <>
        <p className="mb-4">
          Both LLP (Limited Liability Partnership) and Private Limited Company are popular legal structures for Indian businesses, but they serve different needs. Here is the complete breakdown. For a detailed comparison, see our{' '}
          <Link href="/guides/pvt-ltd-vs-llp" className="text-primary underline hover:no-underline">Pvt Ltd vs LLP guide</Link>.
        </p>
        <p className="mb-4">
          <strong>Liability protection:</strong> Both structures offer limited liability - your personal assets are protected if the business faces losses or legal claims. This is the primary reason founders choose either structure over a sole proprietorship or traditional partnership.
        </p>
        <p className="mb-4">
          <strong>Compliance burden:</strong> An LLP has far lower annual compliance requirements - no mandatory board meetings, no statutory registers, and simpler annual filings (just Form 11 and Form 8 with MCA). A Private Limited Company must hold at minimum 4 board meetings per year, maintain detailed statutory registers, file multiple forms with the Registrar of Companies, and get accounts audited regardless of turnover.
        </p>
        <p className="mb-4">
          <strong>Taxation:</strong> Both are taxed at 30% flat on profits plus surcharges. However, a Private Limited Company can offer ESOPs (Employee Stock Option Plans) to employees - not possible with an LLP - making Pvt Ltd the preferred choice for startups planning to hire and retain talent through equity.
        </p>
        <p className="mb-4">
          <strong>Investment:</strong> If you plan to raise funding from angel investors or venture capital, Private Limited is the only viable option. LLPs cannot issue equity shares, cannot have foreign investors under the automatic FDI route for most sectors, and are generally not fundable by institutional investors.
        </p>
        <p className="mb-4">
          <strong>Cost:</strong> LLP registration costs less upfront and costs less annually due to simpler compliance. For a two-partner services business with no plans to raise external funding, an LLP saves Rs 20,000-50,000 per year in compliance costs compared to a Pvt Ltd.
        </p>
        <p className="mb-4">
          <strong>Our recommendation:</strong> Choose LLP if you are a services business (consulting, law, design, accounting), have 2-5 partners, and are not planning to raise external funding in the near term. Choose Private Limited if you are building a product, plan to raise funding, want to issue ESOPs, or are in a sector where Pvt Ltd is the industry standard.
        </p>
        <p className="mb-4">
          <strong>Summary:</strong> Choose LLP if you are a services business (consulting, law, design, accounting), have 2-5 partners, and are not planning to raise external funding. Choose Private Limited if you are building a product, plan to raise funding, want to issue ESOPs, or are in a sector where Pvt Ltd is the industry standard.
        </p>
        <p>
          Ollvy handles registration for both structures -{' '}
          <Link href="/services/llp-incorporation" className="text-primary underline hover:no-underline">
            LLP Incorporation
          </Link>{' '}
          (10-12 working days) and{' '}
          <Link href="/services/pvt-ltd-incorporation" className="text-primary underline hover:no-underline">
            Private Limited Incorporation
          </Link>{' '}
          (12-15 working days).
        </p>
      </>
    ),
  },
  {
    id: 'q2',
    question: 'How long does company registration take in India?',
    answer: (
      <>
        <p className="mb-4">
          Company registration timelines in India have improved significantly since MCA21 Version 3.0 launched in 2022. Here are the realistic timelines for each structure, assuming all documents are in order and there are no queries from the Registrar.
        </p>
        <div className="overflow-x-auto mb-4 rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-muted/30">
                <th className="text-left py-3 pr-4 pl-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Structure</th>
                <th className="text-left py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Typical timeline</th>
                <th className="text-left py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Fastest possible</th>
                <th className="text-left py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">What causes delays</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30">
                <td className="py-3 pr-4 pl-4"><Link href="/services/pvt-ltd-incorporation" className="text-primary hover:underline">Private Limited Company</Link></td>
                <td className="py-3 pr-4 font-mono text-sm">12-15 working days</td>
                <td className="py-3 pr-4 font-mono text-sm">7-8 working days</td>
                <td className="py-3 pr-4 text-muted-foreground">Name rejection (RUN), DSC delays, document issues</td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="py-3 pr-4 pl-4"><Link href="/services/llp-incorporation" className="text-primary hover:underline">LLP</Link></td>
                <td className="py-3 pr-4 font-mono text-sm">10-12 working days</td>
                <td className="py-3 pr-4 font-mono text-sm">6-7 working days</td>
                <td className="py-3 pr-4 text-muted-foreground">Name rejection, partner DSC delays</td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="py-3 pr-4 pl-4">OPC (One Person Company)</td>
                <td className="py-3 pr-4 font-mono text-sm">10-12 working days</td>
                <td className="py-3 pr-4 font-mono text-sm">6-7 working days</td>
                <td className="py-3 pr-4 text-muted-foreground">Nominee consent issues</td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="py-3 pr-4 pl-4"><Link href="/services/gst-registration" className="text-primary hover:underline">GST Registration</Link></td>
                <td className="py-3 pr-4 font-mono text-sm">5-7 working days</td>
                <td className="py-3 pr-4 font-mono text-sm">3-4 working days</td>
                <td className="py-3 pr-4 text-muted-foreground">Officer queries, address proof issues</td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="py-3 pr-4 pl-4"><Link href="/services/trademark-registration" className="text-primary hover:underline">Trademark Registration</Link></td>
                <td className="py-3 pr-4 font-mono text-sm">1-2 days to file, 12-18 months for certificate</td>
                <td className="py-3 pr-4 font-mono text-sm">Filing is instant</td>
                <td className="py-3 pr-4 text-muted-foreground">Examination process is fixed by government</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 pl-4"><Link href="/services/cloud-kitchen-setup" className="text-primary hover:underline">FSSAI License (State)</Link></td>
                <td className="py-3 pr-4 font-mono text-sm">30-45 working days</td>
                <td className="py-3 pr-4 font-mono text-sm">20 working days</td>
                <td className="py-3 pr-4 text-muted-foreground">State authority processing time</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-4">
          The most common cause of delays is document issues - blurry scans, mismatched names between PAN and Aadhaar, address proof older than 2 months, or office address documents that do not match the registration address. Our CA reviews all documents before submission and flags any issues upfront, which is why Ollvy orders consistently complete within the stated timelines.
        </p>
        <p>
          One important note: the working days timeline starts from the date all documents are approved by our CA, not from the date of payment. We recommend having all documents ready before booking to avoid any delays.
        </p>
      </>
    ),
  },
  {
    id: 'q3',
    question: 'What documents are required for LLP registration in India?',
    answer: (
      <>
        <p className="mb-4">
          <Link href="/services/llp-incorporation" className="text-primary underline hover:no-underline">LLP registration</Link> requires documents from three categories: each designated partner, and the registered office. Here is the complete checklist. You can also use our{' '}
          <Link href="/tools/documents/llp" className="text-primary underline hover:no-underline">LLP document checklist tool</Link> to track what you have.
        </p>
        <p className="mb-2 font-semibold">For each designated partner (required for all partners):</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>PAN Card</strong> - self-attested copy. The name on PAN must exactly match the name on Aadhaar. Even a minor mismatch (e.g. middle name included on one but not the other) will cause a rejection.</li>
          <li><strong>Aadhaar Card</strong> - both front and back. Can be submitted as a single PDF or two separate images. The address on Aadhaar does not need to match the office address.</li>
          <li><strong>Passport-size photograph</strong> - recent (within 6 months), white background, no spectacles. JPG or PNG, minimum 200x200 pixels.</li>
          <li><strong>Address proof</strong> - any one of: bank statement (last 3 months), electricity or telephone bill (last 2 months), driving licence, or passport. Must clearly show the partner's current residential address.</li>
        </ul>
        <p className="mb-2 font-semibold">For the registered office:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Rent agreement</strong> - if the office is rented. Must be signed by both owner and tenant and show the complete address matching the registration address.</li>
          <li><strong>No Objection Certificate (NOC) from the property owner</strong> - even if a partner owns the property, an NOC is required. Ollvy provides a standard template.</li>
          <li><strong>Utility bill for the office</strong> - electricity or telephone bill, not older than 2 months, showing the office address.</li>
        </ul>
        <p className="mb-2 font-semibold">Important notes:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>A residential address is completely valid as a registered office address for an LLP. Many founders use their home address, especially at early stage.</li>
          <li>If a partner is a foreign national, additional documents are required: notarised and apostilled copy of passport, foreign address proof, and a valid Indian visa.</li>
          <li>Digital Signature Certificates (DSC) for all partners are arranged by our CA as part of the service. You do not need to organise these separately.</li>
        </ul>
        <p>
          Once you place your order on Ollvy, our document upload system walks you through exactly what is needed for each partner, with specific format requirements and quality guidelines for each document. Our CA reviews every document before submission.
        </p>
      </>
    ),
  },
  {
    id: 'q4',
    question: 'How much does company registration cost in India?',
    answer: (
      <>
        <p className="mb-4">
          The total cost of company registration in India has two components: professional fees (what you pay a CA or service provider) and government fees (paid directly to MCA). Here is a full breakdown.
        </p>
        <div className="overflow-x-auto mb-4 rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-muted/30">
                <th className="text-left py-3 pr-4 pl-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Service</th>
                <th className="text-left py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Ollvy fee</th>
                <th className="text-left py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Govt. fees (approx.)</th>
                <th className="text-left py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Total</th>
                <th className="text-left py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">What's included</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4"><Link href="/services/llp-incorporation" className="text-primary underline hover:no-underline">LLP Incorporation</Link></td>
                <td className="py-2 pr-4">{prices.llp}</td>
                <td className="py-2 pr-4">Rs 500-800</td>
                <td className="py-2 pr-4">{prices.llpTotal}</td>
                <td className="py-2">DSC, name reservation, LLP agreement, Form 2 filing, CoI, compliance calendar</td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4"><Link href="/services/pvt-ltd-incorporation" className="text-primary underline hover:no-underline">Private Limited Company</Link></td>
                <td className="py-2 pr-4">{prices.pvtLtd}</td>
                <td className="py-2 pr-4">Rs 3,000-6,000</td>
                <td className="py-2 pr-4">{prices.pvtLtdTotal}</td>
                <td className="py-2">DSC for 2 directors, SPICe+ filing, PAN, TAN, CoI, MOA/AOA, compliance calendar</td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4">OPC Incorporation</td>
                <td className="py-2 pr-4">{prices.opc}</td>
                <td className="py-2 pr-4">Rs 1,500-3,000</td>
                <td className="py-2 pr-4">{prices.opcTotal}</td>
                <td className="py-2">Single director DSC, SPICe+ filing, CoI, PAN, TAN</td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4"><Link href="/services/gst-registration" className="text-primary underline hover:no-underline">GST Registration</Link></td>
                <td className="py-2 pr-4">{prices.gst}</td>
                <td className="py-2 pr-4">Rs 0</td>
                <td className="py-2 pr-4">{prices.gstTotal}</td>
                <td className="py-2">Portal application, document prep, officer query handling, GSTIN delivery</td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4"><Link href="/services/trademark-registration" className="text-primary underline hover:no-underline">Trademark Registration</Link></td>
                <td className="py-2 pr-4">{prices.trademark}</td>
                <td className="py-2 pr-4">Rs 4,500-9,000</td>
                <td className="py-2 pr-4">{prices.trademarkTotal}</td>
                <td className="py-2">Conflict search, class identification, TM-A filing, examination tracking, certificate</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-4">
          <strong>Why do government fees vary?</strong> For Private Limited Companies, government fees are based on authorised share capital - the higher the authorised capital, the higher the stamp duty and filing fees. Most early-stage companies register with Rs 1 lakh authorised capital, which brings government fees to the lower end of the range.
        </p>
        <p className="mb-4">
          <strong>What is not included:</strong> GST at 18% on professional fees ({prices.llp}) is additional. Government fees are GST-exempt.
        </p>
        <p>
          <strong>How Ollvy compares:</strong> IndiaFilings charges Rs 9,999-14,999 for LLP registration. Vakilsearch charges Rs 11,999-18,999. Ollvy prices are lower because we operate with lower overhead - no branch offices, no sales teams - and pass the savings to you without compromising on quality. Every order is handled by a vetted, experienced CA.
        </p>
      </>
    ),
  },
  {
    id: 'q5',
    question: 'Can I register a company using my home address in India?',
    answer: (
      <>
        <p className="mb-4">
          Yes. Using a residential address as the registered office of a company or LLP is completely legal in India, and is one of the most common approaches taken by early-stage founders. There is no requirement to have a commercial office to register a company.
        </p>
        <p className="mb-2 font-semibold">What you need for home address registration:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>NOC from the property owner</strong> - if you are renting, your landlord must provide a No Objection Certificate. If you own the property, you provide a self-declaration. Ollvy provides standard templates for both. Your landlord does not need to be physically present or sign any MCA forms - the NOC is a simple one-page document.</li>
          <li><strong>Utility bill</strong> - an electricity or telephone bill for the home address, not older than 2 months, showing the address clearly.</li>
        </ul>
        <p className="mb-4">
          <strong>Important:</strong> Some rental agreements have clauses prohibiting commercial use of the premises. Using your home as a registered office technically counts as commercial use. In practice, this is almost never enforced for registered office purposes (as opposed to actually running a business from the address), but it is worth being aware of if your landlord is particular about the terms of your lease.
        </p>
        <p className="mb-4">
          <strong>Can I change the registered office later?</strong> Yes. Once your business grows and you move to a commercial space, you can update the registered office address. For a change within the same city, the process is straightforward (Form INC-22 for companies, Form 15 for LLPs). For a change across cities or states, additional approvals are needed. Ollvy handles registered office changes as a separate service.
        </p>
        <p>
          <strong>GST note:</strong> While a home address is fine for company registration, GST registration for certain business types may require a commercial address or GST-specific address proof. Our CA will flag this if relevant for your business type when you place your order.
        </p>
      </>
    ),
  },
  {
    id: 'q6',
    question: 'What is GST registration and does my business need it?',
    answer: (
      <>
        <p className="mb-4">
          GST (Goods and Services Tax) registration gives your business a GSTIN - a 15-digit unique identification number - and allows you to collect GST from customers, claim input tax credit on purchases, and trade across state lines without restrictions.
        </p>
        <p className="mb-2 font-semibold">When is GST registration mandatory?</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Your annual turnover exceeds Rs 40 lakhs (goods) or Rs 20 lakhs (services). For special category states (Northeast India, Himachal Pradesh, Uttarakhand, J&K), the threshold is lower.</li>
          <li>You sell goods or services across state lines - regardless of turnover.</li>
          <li>You sell on e-commerce platforms (Amazon, Flipkart, Meesho, etc.) - mandatory regardless of turnover.</li>
          <li>You receive payment via reverse charge mechanism.</li>
        </ul>
        <p className="mb-2 font-semibold">When should you register voluntarily (even if below threshold)?</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>You want to claim input tax credit on business purchases - if you are buying equipment, software, or services for your business, GST registration lets you offset that GST against your output liability.</li>
          <li>Your clients are GST-registered businesses - they prefer vendors who can provide GST invoices, as it allows them to claim input tax credit. Without a GSTIN, you may lose B2B contracts.</li>
          <li>You are building credibility - a GSTIN on your invoice signals that you are a legitimate, registered business.</li>
        </ul>
        <p className="mb-4">
          <strong>How long does GST registration take?</strong> Typically 5-7 working days from the date of application, assuming no officer queries. If a query is raised, it can extend to 10-15 working days. Our CA handles all officer queries as part of the{' '}
          <Link href="/services/gst-registration" className="text-primary underline hover:no-underline">GST Registration</Link> service. For a step-by-step walkthrough, see our{' '}
          <Link href="/guides/do-i-need-gst-registration" className="text-primary underline hover:no-underline">complete GST registration guide</Link>.
        </p>
        <p>
          <strong>Penalty for not registering when mandatory:</strong> 10% of the tax due (minimum Rs 10,000), or 100% of the tax due if non-registration is deemed fraudulent.
        </p>
      </>
    ),
  },
  {
    id: 'q7',
    question: 'What is Director KYC and what happens if I miss the deadline?',
    answer: (
      <>
        <p className="mb-4">
          Director KYC is a mandatory compliance requirement for all individuals who hold a Director Identification Number (DIN) in India - regardless of whether the company is active or not. MCA changed this from annual to triennial (every 3 years) effective March 31, 2026. It is now filed using DIR-3 KYC Web on the MCA portal.
        </p>
        <p className="mb-2 font-semibold">Who must file Director KYC?</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Every person who has been allotted a DIN, even if they have resigned as a director from all companies.</li>
          <li>Directors of active Private Limited Companies, OPCs, and Section 8 companies.</li>
          <li>Designated partners of LLPs (they receive a DPIN, which is equivalent to a DIN for this purpose).</li>
        </ul>
        <p className="mb-4">
          <strong>What is the deadline?</strong> The triennial deadline is 30 June every 3 years. Directors who filed KYC by September 30, 2025 are covered until June 30, 2028. If you miss the deadline, your DIN is marked as "Deactivated due to non-filing of DIR-3 KYC."
        </p>
        <p className="mb-2 font-semibold">What happens if you miss the deadline?</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Your DIN is immediately deactivated. You cannot sign any board resolutions, company filings, or legal documents as a director until it is reactivated.</li>
          <li>The company cannot file any MCA forms that require a director's DIN - including annual returns and financial statements - until the DIN is reactivated.</li>
          <li><strong>Penalty:</strong> Rs 5,000 per director for late filing. This fee is paid to MCA and is non-negotiable - there is no way to waive it. Use our{' '}
            <Link href="/tools/penalty-calculator/director-kyc" className="text-primary underline hover:no-underline">Director KYC penalty calculator</Link> to see the exact amount.</li>
          <li><strong>Reactivation process:</strong> File DIR-3 KYC with the Rs 5,000 penalty fee. MCA typically reactivates the DIN within 1-2 working days.</li>
        </ul>
        <p>
          Ollvy sends automated compliance reminders 30 days, 7 days, and 1 day before the{' '}
          <Link href="/services/din-reactivation" className="text-primary underline hover:no-underline">Director KYC</Link>{' '}
          deadline to all users who have a company on our platform. Filing is available as a standalone service at Rs 999 per director.
        </p>
      </>
    ),
  },
  {
    id: 'q8',
    question: 'How does trademark registration work in India, and how long does it take?',
    answer: (
      <>
        <p className="mb-4">
          <Link href="/services/trademark-registration" className="text-primary underline hover:no-underline">Trademark registration</Link> in India gives you the exclusive legal right to use your brand name, logo, or tagline in connection with the goods or services you register it for. Here is how the process works, from start to finish.
        </p>
        <p className="mb-4">
          <strong>Step 1 - Trademark search (1-2 days):</strong> Before filing, our lawyer runs a search on the Trademark Registry database (IP India) to check for identical or similar existing trademarks. If there is a conflict, we advise you before filing - saving you the government fees and a potential rejection.
        </p>
        <p className="mb-4">
          <strong>Step 2 - Class selection:</strong> Trademarks are registered under specific classes from the Nice Classification system (45 classes total - 34 for goods, 11 for services). You are only protected in the class(es) you register. A clothing brand registers under Class 25. A restaurant registers under Class 43. A software product might register under Classes 9 and 42. Registering in the wrong class provides no protection.
        </p>
        <p className="mb-4">
          <strong>Step 3 - TM-A filing (1 day):</strong> The application is filed on the IP India portal. Once filed, you receive an application number and can legally use the TM symbol next to your brand name immediately - even before the trademark is registered.
        </p>
        <p className="mb-4">
          <strong>Step 4 - Examination (3-6 months):</strong> A government examiner reviews the application. They may accept it directly or raise an examination report with objections. If an examination report is raised, your lawyer files a response within 30 days. This is included in the Ollvy trademark service.
        </p>
        <p className="mb-4">
          <strong>Step 5 - Journal publication (4 months):</strong> If accepted, the trademark is published in the Trademark Journal. During this period, any third party can oppose the registration. Oppositions are relatively rare for new, original brands.
        </p>
        <p className="mb-4">
          <strong>Step 6 - Registration certificate:</strong> If there is no opposition, the registration certificate is issued. You can now use the (R) symbol. The certificate is backdated to the original filing date.
        </p>
        <div className="overflow-x-auto mb-4 rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-muted/30">
                <th className="text-left py-3 pr-4 pl-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Stage</th>
                <th className="text-left py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Timeline</th>
                <th className="text-left py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">What you do</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4">Trademark search</td>
                <td className="py-2 pr-4">1-2 days</td>
                <td className="py-2">Nothing - our lawyer handles it</td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4">TM-A filing</td>
                <td className="py-2 pr-4">1 day</td>
                <td className="py-2">Nothing - our lawyer files it</td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4">Examination</td>
                <td className="py-2 pr-4">3-6 months</td>
                <td className="py-2">Nothing unless an examination report is raised</td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4">Journal publication</td>
                <td className="py-2 pr-4">4 months</td>
                <td className="py-2">Nothing unless a third party opposes</td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4">Certificate issued</td>
                <td className="py-2 pr-4">1-2 months after publication</td>
                <td className="py-2">Nothing - delivered to your vault</td>
              </tr>
              <tr className="border-b border-border font-semibold">
                <td className="py-2 pr-4">Total</td>
                <td className="py-2 pr-4">12-18 months typically</td>
                <td className="py-2">Active TM rights from day 1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Government fees:</strong> Rs 4,500 per class for individuals, startups, and small enterprises. Rs 9,000 per class for companies and LLPs. Ollvy's professional fee is {prices.trademark} and covers one class, the conflict search, TM-A filing, and examination response if needed.
        </p>
      </>
    ),
  },
  {
    id: 'q9',
    question: 'What is the difference between an FSSAI registration and an FSSAI licence?',
    answer: (
      <>
        <p className="mb-4">
          FSSAI compliance comes in three tiers depending on the size and nature of your food business. Choosing the wrong tier is one of the most common mistakes food entrepreneurs make. Read our{' '}
          <Link href="/guides/do-i-need-fssai-license" className="text-primary underline hover:no-underline">FSSAI guide</Link> to understand which tier applies to you.
        </p>
        <div className="overflow-x-auto mb-4 rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-muted/30">
                <th className="text-left py-3 pr-4 pl-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Type</th>
                <th className="text-left py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Who needs it</th>
                <th className="text-left py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Annual turnover</th>
                <th className="text-left py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Validity</th>
                <th className="text-left py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Ollvy fee</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4">Basic Registration</td>
                <td className="py-2 pr-4">Petty food businesses, home bakers, street vendors, small dhabas</td>
                <td className="py-2 pr-4">Below Rs 12 lakhs</td>
                <td className="py-2 pr-4">1-5 years</td>
                <td className="py-2">Rs 3,999</td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4">State Licence</td>
                <td className="py-2 pr-4">Restaurants, bakeries, mid-size food manufacturers, caterers</td>
                <td className="py-2 pr-4">Rs 12 lakhs - Rs 20 crores</td>
                <td className="py-2 pr-4">1-5 years</td>
                <td className="py-2">Rs 5,999</td>
              </tr>
              <tr className="border-b border-border/30 bg-muted/30">
                <td className="py-2 pr-4">Central Licence</td>
                <td className="py-2 pr-4">Large manufacturers, importers/exporters, chains with 21+ outlets, milk/meat processing</td>
                <td className="py-2 pr-4">Above Rs 20 crores, or multi-state</td>
                <td className="py-2 pr-4">1-5 years</td>
                <td className="py-2">Rs 8,999</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-4">
          <strong>Key rule:</strong> If you operate from multiple states, you need a separate FSSAI registration/licence for each state of operation - OR a Central Licence that covers all states. A restaurant chain with outlets in Delhi, Mumbai, and Bangalore needs either 3 state licences or 1 central licence.
        </p>
        <p className="mb-4">
          <strong>What happens if you operate without an FSSAI licence?</strong> Penalties range from Rs 1 lakh to Rs 10 lakhs depending on the nature of the violation. Zomato, Swiggy, and other aggregators require a valid FSSAI number to list your restaurant.
        </p>
        <p>
          <strong>Renewal:</strong>{' '}
          <Link href="/services/cloud-kitchen-setup" className="text-primary underline hover:no-underline">FSSAI licences</Link>{' '}
          must be renewed before expiry. Ollvy sends renewal reminders 60 days before expiry for all FSSAI clients on the platform.
        </p>
      </>
    ),
  },
  {
    id: 'q10',
    question: 'Why should I use Ollvy instead of hiring a CA directly or using IndiaFilings or Vakilsearch?',
    answer: (
      <>
        <p className="mb-4">
          This is a fair question and worth answering directly.
        </p>
        <p className="mb-2 font-semibold">Ollvy vs. hiring a local CA directly</p>
        <p className="mb-4">
          A local CA relationship has real advantages - they know your business over time, can give holistic advice, and are accessible by phone. The downsides: pricing is opaque (you often do not know what you are paying until the invoice arrives), timelines are unclear, deliverables are not guaranteed in writing, and if something goes wrong, your only recourse is an uncomfortable conversation.
        </p>
        <p className="mb-4">
          Ollvy gives you the same quality of CA (we vet all professionals on the platform) with fixed, transparent pricing, clear timelines, documented deliverables, and in-app tracking of every stage of your order. You also get a structured document vault - everything delivered to you is stored and accessible, not buried in a WhatsApp chat.
        </p>
        <p className="mb-2 font-semibold">Ollvy vs. IndiaFilings / Vakilsearch / LegalZoom India</p>
        <p className="mb-4">
          These platforms pioneered the online compliance space in India and have strong brand recognition. Their model is primarily lead generation - they collect your enquiry, hand it to a CA or in-house team, and manage it loosely. The experience is often inconsistent: great if you get a good CA, frustrating if you do not.
        </p>
        <p className="mb-2 font-semibold">The specific gaps we built Ollvy to address:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Document collection happens on WhatsApp</strong> on those platforms. Ollvy has a structured in-app upload flow with per-document status, CA review, and rejection handling - all in one place.</li>
          <li><strong>Status updates are email-based or require you to call.</strong> Ollvy has real-time stage tracking in the app.</li>
          <li><strong>Pricing includes upsells and add-ons</strong> that make the final price unclear. Ollvy charges a fixed price with no hidden add-ons.</li>
          <li><strong>Compliance calendar is an afterthought.</strong> Ollvy proactively surfaces upcoming compliance deadlines as a core feature - not a newsletter.</li>
        </ul>
        <p>
          The honest answer: if you want the cheapest possible registration and are comfortable managing the process yourself via WhatsApp and email, IndiaFilings works fine for straightforward cases. If you want a product-grade experience - transparent, trackable, and with your documents in one place - Ollvy is built for that.
        </p>
      </>
    ),
  },
]
}

// Homepage FAQ - shows all questions, prices from DB
export function HomeFAQ({ prices }: { prices: FAQServicePrices }) {
  const FAQ_DATA = getFaqData(prices)
  const { trackEvent } = usePostHogEvents()
  return (
    <section id="faqs" className="bg-background py-12 md:py-16 lg:py-20">
      <div className="container max-w-4xl">
        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Frequently asked questions
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full space-y-3"
          onValueChange={(value) => {
            if (!value) return
            const faq = FAQ_DATA.find((f) => f.id === value)
            trackEvent('faq_expanded', {
              faq_id: value,
              question: faq?.question,
              page_type: 'homepage',
            })
          }}
        >
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="rounded-2xl border border-border/50 bg-card overflow-hidden px-0 data-[state=open]:bg-muted/20 transition-all duration-300 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5 px-6 hover:bg-muted/30 transition-all duration-300 [&[data-state=open]]:border-b [&[data-state=open]]:border-border/30">
                <div className="flex items-start gap-4 pr-4">
                  <span className="font-mono text-xs text-muted-foreground mt-1 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base md:text-lg font-medium text-foreground">
                    {faq.question}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent forceMount className="text-sm text-foreground/90 leading-relaxed px-6 pb-6 pt-4 ml-10">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

