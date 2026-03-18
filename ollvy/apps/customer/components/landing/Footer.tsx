'use client'

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <OllvyWordmark />
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              GST filings. ITR. Payroll. Incorporation. 32 services, fixed prices, verified
              professionals. No hidden fees. No WhatsApp CAs.
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

          {/* Column 2: Products */}
          <FooterColumn
            title="Products"
            links={[
              { label: 'Services', href: '/#services' },
              { label: 'Compliance Calendar', href: '/#compliance-calendar' },
            ]}
          />

          {/* Column 3: Company */}
          <FooterColumn
            title="Company"
            links={[
              { label: 'About', href: '/about' },
              { label: 'Blog', href: '/blog' },
              { label: 'Careers', href: '/careers' },
              { label: 'Contact', href: 'mailto:support@ollvy.com' },
            ]}
          />

          {/* Column 4: Legal */}
          <FooterColumn
            title="Legal"
            links={[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Cancellation Policy', href: '/cancellation' },
              { label: 'Refund Policy', href: '/refunds' },
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
