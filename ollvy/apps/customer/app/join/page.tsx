import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { CheckCircle, Clock, IndianRupee, Shield, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Join Ollvy as a Professional | CAs, CSs, Lawyers',
  description:
    'Join Ollvy as a verified CA, Company Secretary, or Lawyer. Get matched with clients automatically. Weekly payouts. No rate negotiations.',
  alternates: {
    canonical: 'https://ollvy.com/join',
  },
}

const verifications = [
  'ICAI membership number confirmed for all CAs',
  'Bar Council enrollment number confirmed for all lawyers',
  'ICSI certificate number confirmed for Company Secretaries',
  'ID proof and practice certificate reviewed before first order',
  '5-strike SLA enforcement - automatic suspension on the 5th breach',
  'All disputes mediated by Ollvy. The professional is not your problem.',
]

const earnings = [
  {
    service: 'GST Monthly Filing',
    perOrder: '₹1,800-₹2,200',
    frequency: '8-12 clients/month',
    monthly: '₹14,400-₹26,400',
  },
  {
    service: 'Business ITR',
    perOrder: '₹7,000-₹9,000',
    frequency: '3-5 orders/month (seasonal)',
    monthly: '₹21,000-₹45,000',
  },
  {
    service: 'Pvt Ltd Incorporation',
    perOrder: '₹6,000-₹7,500',
    frequency: '2-4 orders/month',
    monthly: '₹12,000-₹30,000',
  },
  {
    service: 'GST Registration',
    perOrder: '₹5,500-₹6,500',
    frequency: '3-6 orders/month',
    monthly: '₹16,500-₹39,000',
  },
]

const benefits = [
  {
    icon: Users,
    title: 'Clients come to you',
    body: 'No outreach. No marketing. Orders arrive in your app based on your city and service expertise.',
  },
  {
    icon: IndianRupee,
    title: 'Weekly payouts',
    body: 'Payouts hit your account every Friday. No invoicing. No chasing. No 60-day payment cycles.',
  },
  {
    icon: Clock,
    title: 'Control your workload',
    body: 'Set your capacity. Go on vacation mode when you need a break. Accept orders that fit your schedule.',
  },
  {
    icon: Shield,
    title: 'Disputes handled by Ollvy',
    body: "If a client is unhappy, we mediate. You're not on WhatsApp arguing about scope at 10pm.",
  },
]

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-background py-24">
          <div className="container">
            <div className="max-w-[720px] mx-auto text-center">
              <Badge className="bg-ollvy-green/10 text-green-400 border border-green-400/20 mb-6">
                FOR CAs, CSs, AND LAWYERS
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display">
                Clients come to you.
                <br />
                Not the other way around.
              </h1>

              <p className="text-lg text-muted-foreground mt-6 max-w-[560px] mx-auto leading-relaxed">
                Join as a verified professional and get matched with clients based on your city and
                service type. Orders come in through the app. You handle them in the app. Payouts
                hit your account every week.
              </p>

              <p className="text-base text-muted-foreground mt-4">
                No cold calls. No rate negotiations. No chasing invoices.
              </p>

              <Button size="lg" className="mt-8">
                Apply to Join
              </Button>

              <p className="text-xs text-muted-foreground mt-3">
                Verification takes 2-3 working days. ICAI/ICSI/Bar Council registration number
                required.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-card py-24">
          <div className="container">
            <h2 className="text-3xl font-semibold text-foreground text-center">
              Why professionals join Ollvy
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-[900px] mx-auto">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon
                return (
                  <Card key={i} className="border border-border bg-background p-6">
                    <Icon size={20} className="text-muted-foreground" strokeWidth={1.5} />
                    <h3 className="font-semibold mt-4 text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {benefit.body}
                    </p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Earnings */}
        <section className="bg-background py-24">
          <div className="container">
            <div className="max-w-[800px] mx-auto">
              <h2 className="text-3xl font-semibold text-foreground text-center">
                What professionals on Ollvy earn
              </h2>
              <p className="text-base text-muted-foreground text-center mt-4">
                Based on current platform activity. Not a guarantee - actual earnings depend on your
                capacity and service mix.
              </p>

              <div className="mt-10 space-y-4">
                {earnings.map((item, i) => (
                  <Card key={i} className="border border-border bg-card p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.service}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.frequency}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Per order</p>
                        <p className="font-mono font-bold text-foreground">{item.perOrder}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Monthly potential</p>
                        <p className="font-mono font-bold text-ollvy-green">{item.monthly}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="border border-border bg-card p-6 mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  A CA in Delhi handling 8-12 GST retainer clients through Ollvy earns approximately{' '}
                  <strong className="text-foreground">₹24,000-₹36,000/month</strong> from the
                  platform - on top of their existing practice.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Verification */}
        <section className="bg-card py-24">
          <div className="container">
            <div className="max-w-[640px] mx-auto">
              <h2 className="text-3xl font-semibold text-foreground text-center">
                How professionals are verified
              </h2>

              <Card className="border border-border bg-background p-6 mt-10">
                <ul className="space-y-4">
                  {verifications.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <CheckCircle
                        size={16}
                        className="text-ollvy-green mt-0.5 shrink-0"
                        strokeWidth={1.5}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-background py-24">
          <div className="container">
            <div className="max-w-[560px] mx-auto text-center">
              <h2 className="text-3xl font-semibold text-foreground">Ready to join?</h2>
              <p className="text-base text-muted-foreground mt-4">
                Fill out the application form. We verify your credentials and get back to you within
                2-3 working days.
              </p>

              <Button size="lg" className="mt-8">
                Apply to Join Ollvy
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                Have questions?{' '}
                <Link href="mailto:professionals@ollvy.com" className="underline hover:text-foreground">
                  Email us at professionals@ollvy.com
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
