import Link from 'next/link'
import { Linkedin, Twitter } from 'lucide-react'

interface FooterLink {
  label: string
  href: string
}

function FooterColumn({ title, links, titleHref }: { title: string; links: FooterLink[]; titleHref?: string }) {
  return (
    <div>
      {titleHref ? (
        <Link
          href={titleHref}
          className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-4 block hover:text-foreground transition-colors"
        >
          {title}
        </Link>
      ) : (
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-4">
          {title}
        </p>
      )}
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function OllvyWordmark() {
  return (
    <Link href="/" className="font-mono text-xl font-bold text-foreground tracking-tight">
      Ollvy
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <OllvyWordmark />
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              You run your business. We handle the rest.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://linkedin.com/company/ollvy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin
                  size={16}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                />
              </a>
              <a
                href="https://twitter.com/ollvy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter
                  size={16}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                />
              </a>
            </div>
          </div>

          {/* Column 2: Tools - Penalty Calculators */}
          <FooterColumn
            title="Calculators"
            titleHref="/tools/penalty-calculator"
            links={[
              { label: 'GST Late Filing', href: '/tools/penalty-calculator/gst-late-filing' },
              { label: 'GST Demand Notice', href: '/tools/penalty-calculator/gst-demand-notice' },
              { label: 'ITR Late Filing', href: '/tools/penalty-calculator/itr-late-filing' },
              { label: 'TDS Late Filing', href: '/tools/penalty-calculator/tds-late-filing' },
              { label: 'MCA Annual Filing', href: '/tools/penalty-calculator/mca-annual-filing' },
              { label: 'Director KYC', href: '/tools/penalty-calculator/director-kyc' },
              { label: 'PF/ESIC Penalty', href: '/tools/penalty-calculator/pf-esic-penalty' },
              { label: 'Professional Tax', href: '/tools/penalty-calculator/professional-tax-penalty' },
              { label: 'Shops & Establishment', href: '/tools/penalty-calculator/shops-establishment-penalty' },
              { label: 'Startup DPIIT', href: '/tools/penalty-calculator/startup-dpiit-compliance' },
            ]}
          />

          {/* Column 3: Document Checklists */}
          <FooterColumn
            title="Checklists"
            titleHref="/tools/documents"
            links={[
              { label: 'Pvt Ltd Documents', href: '/tools/documents/private-limited-company' },
              { label: 'LLP Documents', href: '/tools/documents/llp' },
              { label: 'Partnership Documents', href: '/tools/documents/partnership' },
              { label: 'Sole Proprietor', href: '/tools/documents/sole-proprietor' },
              { label: 'GST Registration', href: '/tools/documents/gst-registration' },
              { label: 'Individual ITR', href: '/tools/documents/individual-itr' },
              { label: 'Business ITR', href: '/tools/documents/business-itr' },
              { label: 'Trademark', href: '/tools/documents/trademark' },
            ]}
          />

          {/* Column 4: Services */}
          <FooterColumn
            title="Services"
            titleHref="/services"
            links={[
              { label: 'Pvt Ltd Registration', href: '/services/pvt-ltd-incorporation' },
              { label: 'LLP Registration', href: '/services/llp-incorporation' },
              { label: 'Business PAN Card', href: '/services/business-pan' },
              { label: 'GST Registration', href: '/services/gst-registration' },
              { label: 'GST Monthly Filing', href: '/services/gst-monthly' },
              { label: 'GST Cancellation', href: '/services/gst-cancellation' },
              { label: 'GST Revocation', href: '/services/gst-revocation' },
              { label: 'Trademark Registration', href: '/services/trademark-registration' },
              { label: 'MSME Registration', href: '/services/msme-registration' },
              { label: 'Cloud Kitchen Setup', href: '/services/cloud-kitchen-setup' },
              { label: 'Business ITR Filing', href: '/services/business-itr' },
              { label: 'Annual Compliance', href: '/services/mca-annual-filing' },
              { label: 'TDS Compliance', href: '/services/tds-monthly-compliance' },
              { label: 'Company Name Change', href: '/services/company-name-change' },
              { label: 'DIN Reactivation', href: '/services/din-reactivation' },
              { label: 'ESOP Structuring', href: '/services/esop-structuring' },
              { label: 'IEPF Claim Consultation', href: '/services/iepf-consultation' },
              { label: 'All Services', href: '/services' },
            ]}
          />

          {/* Column 5: Deadlines */}
          <FooterColumn
            title="Deadlines"
            links={[
              { label: 'Salaried ITR 2026 (Jul 31)', href: '/guides/salaried-itr-2026' },
              { label: 'Business ITR 2026 (Oct 31)', href: '/guides/business-itr-2026' },
              { label: 'Tax Audit 2026 (Sep 30)', href: '/tax-audit-2026' },
              { label: 'Advance Tax Q1 (Jun 15)', href: '/guides/advance-tax-q1-2026' },
              { label: 'GSTR-9 2026 (Dec 31)', href: '/guides/gst-annual-2026' },
              { label: 'TDS Return Q4 (May 31)', href: '/guides/tds-return-q4-fy2026-27' },
              { label: 'MGT-7 2026 (Nov 28)', href: '/guides/mgt-7-2026' },
              { label: 'Director KYC 2026', href: '/guides/director-kyc-2026' },
            ]}
          />

          {/* Column 6: Guides */}
          <FooterColumn
            title="Guides"
            titleHref="/guides"
            links={[
              { label: 'Do I Need GST?', href: '/guides/do-i-need-gst-registration' },
              { label: 'Do I Need to File ITR?', href: '/guides/do-i-need-to-file-itr' },
              { label: 'Which ITR Form?', href: '/guides/which-itr-form-should-i-use' },
              { label: 'Advance Tax Explained', href: '/guides/advance-tax-explained' },
              { label: 'TDS on Rent', href: '/guides/tds-on-rent-194i-194ib' },
              { label: 'TDS on Property Purchase', href: '/guides/tds-on-property-purchase-194ia' },
              { label: 'LUT for Exports', href: '/guides/lut-for-exports' },
              { label: 'Pvt Ltd vs LLP', href: '/guides/pvt-ltd-vs-llp' },
              { label: 'Business PAN', href: '/guides/what-is-business-pan' },
              { label: 'IEC (Import Export Code)', href: '/guides/iec-import-export-code' },
              { label: 'Do I Need a Trademark?', href: '/guides/do-i-need-trademark-registration' },
              { label: 'MSME / Udyam Registration', href: '/guides/is-msme-registration-worth-it' },
              { label: 'DPIIT Startup Recognition', href: '/guides/should-i-get-dpiit-startup-recognition' },
              { label: 'FSSAI Licence', href: '/guides/do-i-need-fssai-license' },
              { label: 'Shop & Establishment', href: '/guides/do-i-need-shop-establishment-registration' },
              { label: 'Professional Tax', href: '/guides/do-i-need-professional-tax-registration' },
              { label: 'When PF Becomes Mandatory', href: '/guides/when-does-pf-registration-become-mandatory' },
              { label: 'When ESI Becomes Mandatory', href: '/guides/when-does-esi-registration-become-mandatory' },
              { label: 'MCA Annual Filing', href: '/guides/mca-annual-filing-aoc-4-mgt-7' },
              { label: 'AGM Compliance', href: '/guides/agm-compliance' },
              { label: 'DIR-3 KYC', href: '/guides/dir-3-kyc-explained' },
              { label: 'ESOP Structuring', href: '/guides/esop-structuring' },
              { label: 'IEPF Claim', href: '/guides/iepf-claim' },
              { label: 'All Guides', href: '/guides' },
            ]}
          />

          {/* Column 7: Notices */}
          <FooterColumn
            title="Notice Help"
            titleHref="/guides"
            links={[
              { label: 'GST DRC-01 Notice', href: '/guides/gst-drc-01-notice' },
              { label: 'GST ASMT-10 Notice', href: '/guides/gst-asmt-10-notice' },
              { label: 'IT 143(1) Intimation', href: '/guides/income-tax-143-1-intimation' },
              { label: 'IT 148/148A Notice', href: '/guides/income-tax-148-148a-reopening' },
              { label: 'TDS Short Deduction', href: '/guides/tds-short-deduction-notice' },
            ]}
          />

          {/* Column 8: Legal */}
          <FooterColumn
            title="Legal"
            links={[
              { label: 'About', href: '/about' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Cancellation Policy', href: '/cancellation' },
              { label: 'Refund Policy', href: '/refunds' },
              { label: 'Contact', href: 'mailto:support@ollvy.com' },
            ]}
          />
        </div>

        {/* Bottom row */}
        <div className="border-t border-border mt-10 pt-6 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            Ollvy is a private professional services firm. Not affiliated with any government department. Government fees, where applicable, are paid directly to the relevant authority.
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Ollvy Collective Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
