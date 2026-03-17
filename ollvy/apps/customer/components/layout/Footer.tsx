import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black/40">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Company */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-white inline-block mb-4">
              ollvy
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-[280px]">
              Professional services marketplace for businesses.
              Connect with CAs, Lawyers, and other experts.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-medium text-white mb-4">Services</h3>
            <ul className="space-y-3">
              {[
                { href: '/?type=CA', label: 'CA Services' },
                { href: '/?type=Lawyer', label: 'Legal Services' },
                { href: '/?type=CS', label: 'Company Secretary' },
                { href: '/retainers', label: 'Retainer Plans' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-medium text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {[
                { href: '/help', label: 'Help Center' },
                { href: '/contact', label: 'Contact Us' },
                { href: 'mailto:support@ollvy.com', label: 'support@ollvy.com' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/refund', label: 'Refund Policy' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] text-center">
          <p className="text-sm text-white/30">
            {new Date().getFullYear()} Ollvy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
