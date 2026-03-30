import Link from 'next/link'
import { Linkedin, Twitter } from 'lucide-react'

interface FooterLink {
  label: string
  href: string
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-4">
        {title}
      </p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
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
            links={[
              { label: 'Pvt Ltd Registration', href: '/services/pvt-ltd-incorporation' },
              { label: 'LLP Registration', href: '/services/llp-incorporation' },
              { label: 'GST Registration', href: '/services/gst-registration' },
              { label: 'GST Monthly Filing', href: '/services/gst-monthly-50l' },
              { label: 'GST Cancellation', href: '/services/gst-cancellation' },
              { label: 'GST Revocation', href: '/services/gst-revocation' },
              { label: 'Trademark Registration', href: '/services/trademark-registration' },
              { label: 'MSME Registration', href: '/services/msme-registration' },
              { label: 'Cloud Kitchen Setup', href: '/services/cloud-kitchen-setup' },
              { label: 'Business ITR Filing', href: '/services/business-itr' },
              { label: 'Annual Compliance', href: '/services/mca-annual-filing' },
              { label: 'Company Name Change', href: '/services/company-name-change' },
              { label: 'DIN Reactivation', href: '/services/din-reactivation' },
              { label: 'TDS Compliance', href: '/services/tds-monthly-compliance' },
              { label: 'All Services', href: '/services' },
            ]}
          />

          {/* Column 5: Guides */}
          <FooterColumn
            title="Guides"
            links={[
              { label: 'Do I Need GST?', href: '/guides/do-i-need-gst-registration' },
              { label: 'Pvt Ltd vs LLP', href: '/guides/pvt-ltd-vs-llp' },
              { label: 'Which ITR Form?', href: '/guides/which-itr-form-should-i-use' },
              { label: 'DPIIT Recognition', href: '/guides/should-i-get-dpiit-startup-recognition' },
              { label: 'All Guides', href: '/guides' },
            ]}
          />

          {/* Column 6: Notices */}
          <FooterColumn
            title="Notice Help"
            links={[
              { label: 'GST DRC-01 Notice', href: '/guides/gst-drc-01-notice' },
              { label: 'GST ASMT-10 Notice', href: '/guides/gst-asmt-10-notice' },
              { label: 'IT 143(1) Intimation', href: '/guides/income-tax-143-1-intimation' },
              { label: 'IT 148/148A Notice', href: '/guides/income-tax-148-148a-reopening' },
              { label: 'TDS Short Deduction', href: '/guides/tds-short-deduction-notice' },
            ]}
          />

          {/* Column 7: Legal */}
          <FooterColumn
            title="Legal"
            links={[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Cancellation Policy', href: '/cancellation' },
              { label: 'Refund Policy', href: '/refunds' },
              { label: 'Contact', href: 'mailto:support@ollvy.com' },
            ]}
          />
        </div>

        {/* Bottom row */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-2 flex-wrap">
          <p className="text-xs text-muted-foreground">
            © 2025 Ollvy Technologies Private Limited. All rights reserved.
          </p>
          <div className="flex gap-4 flex-wrap">
            <p className="text-xs text-muted-foreground font-mono">CIN: U72900KA2024PTC186XXX</p>
            <p className="text-xs text-muted-foreground font-mono">GSTIN: 29AABCO1234X1ZX</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
